import React from 'react';

const App = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-4 sm:p-6">
      <div className="max-w-xl w-full bg-gray-800 rounded-2xl shadow-lg p-8 sm:p-10 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">Account and Data Deletion for SpeakingMate</h1>
        <p className="text-gray-400 mb-6 sm:mb-8">
          At SpeakingMate, we respect your privacy. This page provides information on how you can request the deletion of your account and all associated personal data from our systems.
        </p>

        {/* Steps Section */}
        <div className="bg-gray-700 rounded-xl p-6 mb-6 sm:mb-8 text-left">
          <h2 className="font-semibold text-lg mb-4">Steps to Delete Your SpeakingMate Account</h2>
          <ol className="list-decimal list-inside space-y-4 text-gray-300">
            <li>
              Send a formal request by clicking the link below to open an email draft.
            </li>
            <li>
              In the email, please include your **registered email address** and your **SpeakingMate username**. This helps us verify your identity.
            </li>
            <li>
              Once we receive your request, our support team will process it within **30 days**. You will receive a confirmation email once your account has been successfully deleted.
            </li>
          </ol>
        </div>

        {/* Data Deletion Policy */}
        <div className="bg-gray-700 rounded-xl p-6 mb-6 sm:mb-8 text-left">
          <h2 className="font-semibold text-lg mb-4">Data Deletion Policy</h2>
          <p className="text-gray-300 mb-4">
            Upon successful deletion, the following data associated with your account will be permanently erased from our servers:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-300 mb-4">
            <li>User profile information (name, email, profile picture)</li>
            <li>App usage history</li>
            <li>Any user-generated content you have created or stored in the app</li>
            <li>Your chat and conversation history</li>
          </ul>
          <p className="text-gray-300">
            <span className="font-semibold text-white">Retention Period:</span> Please note that while we delete most personal data upon request, some anonymized data (e.g., app crash logs, analytics data) may be retained for a limited period to ensure the stability and performance of SpeakingMate. This data cannot be used to identify you personally.
          </p>
        </div>

        {/* Email Deletion Link */}
        <a 
          href="mailto:support@speakingmate.com?subject=SpeakingMate%20Account%20and%20Data%20Deletion%20Request&body=Hello%2C%0A%0AI%20would%20like%20to%20request%20the%20deletion%20of%20my%20SpeakingMate%20account%20and%20all%20associated%20data.%0A%0AUser%20Email%3A%20%5BYour%20Email%20Address%5D%0AUser%20Name%3A%20%5BYour%20Username%5D%0A%0AThank%20you." 
          className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-gray-900 bg-gray-200 hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors duration-200"
        >
          Request Deletion via Email
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
        </a>
      </div>
    </div>
  );
};

export default App;
