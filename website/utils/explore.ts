export const QUIZ_ANSWER_LOCAL_STORAGE_KEY = 'expertAnswers'

export const setExpertValue = (step_name: string , value: string[] ) => {
    const quizStepValue = localStorage.getItem(QUIZ_ANSWER_LOCAL_STORAGE_KEY)

    let quizAnswers = {}

    // console.log(quizStepValue);

    if (quizStepValue) {
        quizAnswers = JSON.parse(quizStepValue);
     }

    quizAnswers[step_name] = value;

    localStorage.setItem( QUIZ_ANSWER_LOCAL_STORAGE_KEY, JSON.stringify(quizAnswers));

};