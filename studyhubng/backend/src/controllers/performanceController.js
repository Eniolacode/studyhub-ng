const supabase = require('../config/supabase');

// @desc    Record a question attempt
// @route   POST /api/performance
// @access  Private
const recordAttempt = async (req, res) => {
  const { questionId, passed } = req.body;

  try {
    const { data, error } = await supabase
      .from('performance')
      .insert([
        {
          user_id: req.user.id,
          question_id: questionId,
          passed
        }
      ])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('Error recording attempt:', error.message);
    res.status(500).json({ message: 'Server Error recording attempt' });
  }
};

// @desc    Get performance dashboard stats
// @route   GET /api/performance/dashboard
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const { data: attempts, error } = await supabase
      .from('performance')
      .select(`
        *,
        questions (
          subject,
          topic
        )
      `)
      .eq('user_id', req.user.id)
      .order('attempted_at', { ascending: false });

    if (error) throw error;

    // Calculate basic stats
    const totalAttempts = attempts.length;
    const passedAttempts = attempts.filter(a => a.passed).length;
    const avgScore = totalAttempts === 0 ? 0 : Math.round((passedAttempts / totalAttempts) * 100);
    
    const uniqueQuestions = new Set(attempts.map(a => a.question_id));
    
    // Group by topic to find weakest topics for recommendations
    const topicStats = {};
    attempts.forEach(a => {
      const topic = a.questions?.topic || 'Unknown';
      if (!topicStats[topic]) topicStats[topic] = { total: 0, passed: 0 };
      topicStats[topic].total++;
      if (a.passed) topicStats[topic].passed++;
    });

    const recommendations = Object.entries(topicStats)
      .map(([topic, stats]) => ({
        topic,
        successRate: stats.total === 0 ? 0 : (stats.passed / stats.total) * 100
      }))
      .filter(t => t.successRate < 70) // Recommend topics with < 70% success rate
      .sort((a, b) => a.successRate - b.successRate)
      .slice(0, 3)
      .map(t => `Review ${t.topic} concepts`);

    // If they are doing great, give generic recommendations
    if (recommendations.length === 0) {
      recommendations.push('Keep practicing recent topics', 'Try a Hard difficulty question', 'Review past mistakes');
    }

    res.json({
      totalAttempts,
      questionsMastered: passedAttempts,
      avgScore,
      uniqueQuestionsAttempted: uniqueQuestions.size,
      recentAttempts: attempts.slice(0, 10).map(a => ({
        id: a.id,
        date: new Date(a.attempted_at).toLocaleString(),
        topic: a.questions?.topic || 'Unknown',
        questionId: a.question_id,
        passed: a.passed
      })),
      recommendations,
      topicStats
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error.message);
    res.status(500).json({ message: 'Server Error fetching stats' });
  }
};

module.exports = {
  recordAttempt,
  getDashboardStats
};
