// PUBLIC display settings only. Never put SMS credentials or a GitHub token here.
window.PORTAL_CONFIG = {
  teacher: 'Hasith Dilshan', subject: 'Science',
  classes: [
    { id:'ol2026', name:'O/L 2026', subtitle:'Ordinary Level Science', prefix:'265340', digits:2, year:2026, exam:'2026-12-08T08:30:00+05:30' },
    { id:'grade10', name:'Grade 10', subtitle:'Building a strong foundation', prefix:'276340', digits:2, year:2026, exam:null },
    { id:'grade9', name:'Grade 9', subtitle:'Science, step by step', prefix:'28734', digits:3, year:2026, exam:null },
    { id:'grade8', name:'Grade 8', subtitle:'Science, step by step', prefix:'29834', digits:3, year:2026, exam:null },
    { id:'grade7', name:'Grade 7', subtitle:'Science, step by step', prefix:'30934', digits:3, year:2026, exam:null },
    { id:'grade6', name:'Grade 6', subtitle:'Science, step by step', prefix:'31034', digits:3, year:2026, exam:null }
  ],
  // Legacy data.js used A for blanks. Keep old published records as supplied.
  // The optional exporter distinguishes Not marked in new data.
  updatedAt: '2026-10-25T10:31:56+05:30',
  refreshSeconds: 90
};
