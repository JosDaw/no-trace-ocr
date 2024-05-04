/**
 * Returns the corresponding error message for a given Firebase error code.
 * If the error code is not recognized, it returns a default error message.
 *
 * @param errorMessage - The Firebase error message.
 * @returns The corresponding error message for the given error code, or a default error message if the error code is not recognized.
 */
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

/**
 * Converts new lines in a string to HTML paragraphs.
 *
 * @param text - The input string to convert.
 * @returns The converted string with HTML paragraphs.
 */
export function convertNewLinesToHTML(text: string): string {
  return text
    .split('\n')
    .map((line) => `<p>${line}</p>`)
    .join('');
}

/**
 * Calculates the strength of a password based on given requirements.
 * @param password - The password to evaluate.
 * @param requirements - An array of regular expressions representing the password requirements.
 * @returns The strength of the password as a number between 0 and 100.
 */
export function getStrength(password: string, requirements: { re: RegExp }[]) {
  let multiplier = password.length > 5 ? 0 : 1;

  requirements.forEach((requirement) => {
    if (!requirement.re.test(password)) {
      multiplier += 1;
    }
  });

  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 0);
}

/**
 * Formats a number into a currency display.
 *
 * @param amount - The number to format.
 * @returns The formatted currency string.
 */
export function formatCurrency(amount: number): string {
  // Format the number into currency display
  const formattedAmount: string = `$${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;

  return formattedAmount;
}

/**
 * Generates a unique token by combining the current timestamp and a random number.
 * @returns {string} The generated unique token.
 */
export function generateUniqueToken(): string {
  // Get the current timestamp in milliseconds
  const timestamp = new Date().getTime();

  // Generate a random number to ensure additional randomness
  const randomNumber = Math.floor(Math.random() * 1000000);

  // Convert both numbers to base-36 (alphanumeric) and pad if necessary
  const timestampPart = timestamp.toString(36);
  const randomPart = randomNumber.toString(36).padStart(6, '0');

  // Concatenate both parts to form a token
  return `free_${timestampPart}${randomPart}`;
}
