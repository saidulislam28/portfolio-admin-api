export const formateServiceType = (type: string) => {
  const serviceTypeMap = {
    book_purchase: 'Book',
    ielts_gt: 'IELTS General Test',
    ielts_academic: 'IELTS Academic Test',
    spoken: 'Spoken Test',
    speaking_mock_test: 'Mock Test',
    conversation: 'Conversation Test',
    exam_registration: 'Exam Registration',
  };

  return serviceTypeMap[type] || type;
};
