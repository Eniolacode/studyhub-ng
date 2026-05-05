const supabase = require('../config/supabase');

// Helper to calculate truth score
const calculateTruthScore = (yearsAppeared) => {
  if (!yearsAppeared || !Array.isArray(yearsAppeared) || yearsAppeared.length === 0) return 0;
  return Math.min(Math.round((yearsAppeared.length / 6) * 100), 100);
};

// @desc    Get all questions (with calculated Truth Score)
// @route   GET /api/questions
// @access  Private (Student/Admin)
const getQuestions = async (req, res) => {
  try {
    const { data: questions, error } = await supabase
      .from('questions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // We also need to know which questions the user has practiced
    const { data: performance, error: perfError } = await supabase
      .from('performance')
      .select('question_id')
      .eq('user_id', req.user.id);

    if (perfError) throw perfError;

    const practicedSet = new Set(performance.map(p => p.question_id));

    // Calculate Truth Score dynamically and format the response
    const formattedQuestions = questions.map(q => {
      // Create a copy of the object but swap years_appeared for truthScore
      const truthScore = calculateTruthScore(q.years_appeared);
      
      // We don't have successRate in the DB natively, so we mock it or calculate it later.
      // For MVP, we can return a static successRate or 0 if not implemented globally.
      
      return {
        id: q.id,
        subject: q.subject,
        topic: q.topic,
        examType: q.exam_type,
        difficulty: q.difficulty,
        question: q.question,
        options: q.options,
        answer: q.answer,
        explanation: q.explanation,
        tags: q.tags,
        truthScore,
        attempts: 0, // Mock for now globally
        successRate: 0, // Mock for now globally
        practiced: practicedSet.has(q.id)
      };
    });

    res.json(formattedQuestions);
  } catch (error) {
    console.error('Error fetching questions:', error.message);
    res.status(500).json({ message: 'Server Error fetching questions' });
  }
};

// @desc    Create a question
// @route   POST /api/questions
// @access  Private (Admin only)
const createQuestion = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  const { id, subject, topic, examType, difficulty, question, options, answer, explanation, tags, truthScore } = req.body;

  try {
    // Reverse engineer truthScore back to years_appeared for MVP storage
    // If Truth Score is 100, that's 6 appearances.
    const appearances = Math.round((truthScore / 100) * 6);
    const years_appeared = Array.from({ length: appearances }, (_, i) => 2024 - i);

    const { data, error } = await supabase
      .from('questions')
      .insert([
        {
          id,
          subject,
          topic,
          exam_type: examType,
          difficulty,
          question,
          options,
          answer,
          explanation,
          tags: tags || [],
          years_appeared
        }
      ])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating question:', error.message);
    res.status(500).json({ message: 'Server Error creating question' });
  }
};

// @desc    Update a question
// @route   PUT /api/questions/:id
// @access  Private (Admin only)
const updateQuestion = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  const { subject, topic, examType, difficulty, question, options, answer, explanation, tags, truthScore } = req.body;

  try {
    const appearances = Math.round((truthScore / 100) * 6);
    const years_appeared = Array.from({ length: appearances }, (_, i) => 2024 - i);

    const { data, error } = await supabase
      .from('questions')
      .update({
        subject,
        topic,
        exam_type: examType,
        difficulty,
        question,
        options,
        answer,
        explanation,
        tags: tags || [],
        years_appeared
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error updating question:', error.message);
    res.status(500).json({ message: 'Server Error updating question' });
  }
};

// @desc    Delete a question
// @route   DELETE /api/questions/:id
// @access  Private (Admin only)
const deleteQuestion = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  try {
    const { error } = await supabase
      .from('questions')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: 'Question removed' });
  } catch (error) {
    console.error('Error deleting question:', error.message);
    res.status(500).json({ message: 'Server Error deleting question' });
  }
};

// @desc    Bulk create questions
// @route   POST /api/questions/bulk
// @access  Private (Admin only)
const bulkCreateQuestions = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  const questions = req.body;

  if (!Array.isArray(questions)) {
    return res.status(400).json({ message: 'Request body must be an array of questions' });
  }

  try {
    // Format questions for DB storage
    const formatted = questions.map(q => {
      const appearances = Math.round(((q.truthScore || 0) / 100) * 6);
      const years_appeared = Array.from({ length: appearances }, (_, i) => 2024 - i);
      
      return {
        id: q.id,
        subject: q.subject,
        topic: q.topic,
        exam_type: q.examType || q.exam_type,
        difficulty: q.difficulty,
        question: q.question,
        options: q.options,
        answer: q.answer,
        explanation: q.explanation,
        tags: q.tags || [],
        years_appeared
      };
    });

    const { data, error } = await supabase
      .from('questions')
      .upsert(formatted, { onConflict: 'id' })
      .select();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('Bulk Upload Error:', error.message);
    res.status(500).json({ message: 'Server Error during bulk upload' });
  }
};

module.exports = {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  bulkCreateQuestions
};
