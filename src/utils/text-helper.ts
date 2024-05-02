export function getFirebaseError(errorMessage: string): string {
  const errorCodeMatch = errorMessage.match(/\(([^)]+)\)/);
  const errorCode = errorCodeMatch ? errorCodeMatch[1] : '';

  const errorMessages: { [key: string]: string } = {
    'auth/invalid-action-code':
      'The action code or link is invalid. This can happen if the code is malformed, expired, or has already been used.',
    'auth/user-disabled': 'Your account has been disabled by an administrator.',
    'auth/user-not-found': 'No user found with this email address.',
    'auth/wrong-password':
      'Wrong password. Try again or click on "Forgot password?" to reset it.',
    'auth/email-already-in-use':
      'An account already exists with the email address you provided.',
    'auth/weak-password':
      'The password is too weak. Please enter a stronger password.',
    'auth/too-many-requests':
      'We have blocked all requests from this device due to unusual activity. Try again later.',
    'auth/network-request-failed':
      'A network error has occurred. Check your network connection and try again.',
    'auth/invalid-email': 'The email address is badly formatted.',
    'auth/invalid-credential':
      'Invalid credentials. Please check your email and password and try again.',
  };

  return (
    errorMessages[errorCode] || 'An unknown error occurred. Please try again.'
  );
}

export function convertNewLinesToHTML(text: string): string {
  return text
    .split('\n')
    .map((line) => `<p>${line}</p>`)
    .join('');
}
