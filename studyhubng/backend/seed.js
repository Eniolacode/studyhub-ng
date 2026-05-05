const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const nigerianQuestions = [
  {
    id: 'GST-101-01',
    subject: 'Use of English',
    topic: 'Lexis and Structure',
    exam_type: 'University CBT',
    difficulty: 'Medium',
    question: 'Choose the option that is most nearly opposite in meaning to the underlined word: The manager’s behavior was quite <u>erratic</u>.',
    options: ['Consistent', 'Predictable', 'Strange', 'Normal'],
    answer: 'Predictable',
    explanation: 'Erratic means unpredictable or inconsistent. The opposite is predictable.',
    tags: ['GST101', 'English'],
    years_appeared: [2018, 2019, 2021, 2022, 2023]
  },
  {
    id: 'ENG-201-01',
    subject: 'Engineering Mathematics',
    topic: 'Matrices',
    exam_type: 'Departmental Exam',
    difficulty: 'Hard',
    question: 'Given a 2x2 matrix A = [[4, 2], [1, 3]], calculate the determinant of A.',
    options: ['10', '14', '8', '12'],
    answer: '10',
    explanation: 'Det(A) = (4 * 3) - (2 * 1) = 12 - 2 = 10.',
    tags: ['Engineering', 'Maths'],
    years_appeared: [2020, 2021, 2023, 2024]
  },
  {
    id: 'ECO-102-01',
    subject: 'Microeconomics',
    topic: 'Demand and Supply',
    exam_type: 'Faculty Exam',
    difficulty: 'Medium',
    question: 'According to the law of demand, if the price of a commodity increases, the quantity demanded ________.',
    options: ['Increases', 'Decreases', 'Remains constant', 'Fluctuates'],
    answer: 'Decreases',
    explanation: 'The law of demand states that there is an inverse relationship between price and quantity demanded.',
    tags: ['Economics', 'Social Sciences'],
    years_appeared: [2017, 2018, 2019, 2022, 2023, 2024]
  },
  {
    id: 'CSC-201-01',
    subject: 'Computer Science',
    topic: 'Data Structures',
    exam_type: 'University CBT',
    difficulty: 'Hard',
    question: 'Which of the following data structures works on the LIFO (Last-In-First-Out) principle?',
    options: ['Queue', 'Linked List', 'Stack', 'Tree'],
    answer: 'Stack',
    explanation: 'A Stack is a LIFO structure where the last element added is the first one to be removed.',
    tags: ['CSC', 'Programming'],
    years_appeared: [2021, 2023, 2024]
  },
  {
    id: 'GST-102-01',
    subject: 'Philosophy and Logic',
    topic: 'Fallacies',
    exam_type: 'University CBT',
    difficulty: 'Medium',
    question: 'An argument that attacks the person rather than the position they are maintaining is known as ________.',
    options: ['Ad hominem', 'Ad populum', 'Straw man', 'Red herring'],
    answer: 'Ad hominem',
    explanation: 'Ad hominem is a fallacy where the attack is directed at the person instead of the argument.',
    tags: ['GST102', 'Philosophy'],
    years_appeared: [2019, 2020, 2022, 2024]
  },
  {
    id: 'BIO-101-01',
    subject: 'Biology',
    topic: 'Cell Biology',
    exam_type: 'University CBT',
    difficulty: 'Easy',
    question: 'Which organelle is often referred to as the powerhouse of the cell?',
    options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi apparatus'],
    answer: 'Mitochondria',
    explanation: 'Mitochondria are responsible for ATP production, providing energy for the cell.',
    tags: ['BIO101', 'Sciences'],
    years_appeared: [2018, 2020, 2021, 2022, 2023, 2024]
  },
  {
    id: 'CHM-101-01',
    subject: 'Chemistry',
    topic: 'Atomic Structure',
    exam_type: 'University CBT',
    difficulty: 'Medium',
    question: 'The number of protons in the nucleus of an atom is called its ________.',
    options: ['Mass number', 'Atomic number', 'Isotope number', 'Valency'],
    answer: 'Atomic number',
    explanation: 'The atomic number defines the identity of an element and equals the number of protons.',
    tags: ['CHM101', 'Sciences'],
    years_appeared: [2019, 2021, 2023]
  },
  {
    id: 'POL-101-01',
    subject: 'Political Science',
    topic: 'Government Types',
    exam_type: 'University CBT',
    difficulty: 'Medium',
    question: 'A system of government where power is divided between a central authority and constituent political units is ________.',
    options: ['Unitary', 'Federal', 'Confederal', 'Monarchy'],
    answer: 'Federal',
    explanation: 'Federalism involves power sharing between central and regional governments (like in Nigeria).',
    tags: ['POL101', 'Social Sciences'],
    years_appeared: [2017, 2018, 2020, 2022, 2024]
  },
  {
    id: 'GST-103-01',
    subject: 'Nigerian Peoples and Culture',
    topic: 'Pre-colonial History',
    exam_type: 'University CBT',
    difficulty: 'Medium',
    question: 'The pre-colonial political system of the Igbo people was largely ________.',
    options: ['Monarchical', 'Centralized', 'Acephalous', 'Theocratic'],
    answer: 'Acephalous',
    explanation: 'Acephalous means "headless" or decentralized, describing the segmentary lineage system of traditional Igbo society.',
    tags: ['GST103', 'Culture'],
    years_appeared: [2018, 2019, 2021, 2023, 2024]
  },
  {
    id: 'ENG-202-01',
    subject: 'Engineering Mathematics',
    topic: 'Calculus',
    exam_type: 'Departmental Exam',
    difficulty: 'Hard',
    question: 'Find the derivative of f(x) = x^3 + 4x^2 - 5x + 7.',
    options: ['3x^2 + 8x - 5', '2x^2 + 4x', '3x^2 + 4x - 5', 'x^2 + 8x'],
    answer: '3x^2 + 8x - 5',
    explanation: 'Using the power rule: d/dx(x^n) = nx^(n-1). So, 3x^2 + 8x - 5.',
    tags: ['Engineering', 'Maths'],
    years_appeared: [2021, 2022, 2024]
  }
];

async function seed() {
  console.log('🚀 Seeding Nigerian University Questions...');
  
  const { error } = await supabase
    .from('questions')
    .upsert(nigerianQuestions, { onConflict: 'id' });

  if (error) {
    console.error('❌ Error seeding questions:', error.message);
  } else {
    console.log('✅ Successfully seeded 5 high-quality questions!');
  }
}

seed();
