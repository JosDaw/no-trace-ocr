# No Trace OCR

Welcome to No Trace OCR, a secure, convenient, and affordable tool for PDF/image to text conversion using OCR processes.

This project is open source! Feel free to contribute by creating a pull request or forking a version for your own use.

## Description

No Trace OCR provides a secure, convenient, and affordable way to convert documents using OCR processes. It ensures that sensitive information remains confidential throughout the conversion process.

## How To Contribute

Please read our [Contributing](/CONTRIBUTING.md) guide to learn how to get started. Make sure to follow the [Code of Conduct](/CODE_OF_CONDUCT.md) to maintain a positive and inclusive community.

## Tech Stack

### Frontend

- Next.js & TypeScript
- Mantine Components & TailwindCSS for styling
- Zustand for state management

### Backend

- Firebase for authentication, email verification, and database
- Google Cloud Vision for OCR processing
- Google Cloud Storage (Ephemeral Only) for temporary storage
- PayPal for payments

## How to Setup & Install

1. Create an .env.local file based on .env.
2. Obtain credentials for the following services:

- Firebase (create a database and authentication, allow email/password authentication)
- PayPal
- Brevo
- Google Cloud: Create a service account and generate a key for GOOGLE_APPLICATION_CREDENTIALS, GOOGLE_CLOUD_STORAGE_CREDENTIALS, GOOGLE_CLOUD_EMAIL, etc.

3. Enable the Google Cloud Vision and Google Cloud Storage APIs and create a new bucket in the storage (note: there may be a small fee for the monthly bucket - remember to delete it after use!).
4. Ensure that the Google service account you created has admin/create/edit/delete access to the storage bucket and to Google Cloud Vision.
5. Add the obtained credentials to your .env.local file.
6. Run `npm install` in your terminal to install all required dependencies.
7. Run `npm run dev` to start the development server.

## License

This project is licensed under the MIT License.

## Contact Information

For questions or feedback, please contact us at <open.source@constantlearning.org>.

## Project Status

No Trace OCR is actively maintained and under continuous development.

### Future Goals

- Implement Cypress testing for improved reliability.
- Explore additional OCR services to enhance accuracy or support different formatting requirements.
- Introduce font options for the editor and download functionality.
