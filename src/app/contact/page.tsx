'use client'
import { Box, Button, Container, Text, TextInput, Textarea, Title } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { FormEvent, useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.email === "" || formData.name === "" || formData.message === "") {
      showNotification({
        title: "Error",
        message: 'Please fill in all fields',
        color: "red",
      });
      setIsLoading(false);
      return;
    }

    const brevoKey = process.env.NEXT_PUBLIC_BREVO_API_KEY || "";
    const brevoURL = process.env.NEXT_PUBLIC_BREVO_URL || "";

    const requestOptions = {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": brevoKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: "No Trace OCR",
          email: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
        },
        to: [
          {
            email: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
            name: "No Trace OCR",
          },
        ],
        subject: "No Trace OCR Contact Form",
        htmlContent: `<html><body>
        <h1>No Trace OCR Contact Form</h1>
        <h3>Name: ${formData.name}</h3>
        <h3>Email: ${formData.email}</h3>
        <h3>Message:</h3>
        <p>${formData.message}</p>
        </body></html>`,
      }),
    };

    try {
      const response = await fetch(brevoURL, requestOptions);
      const result = await response.json();

      if (result.messageId) {
        setIsLoading(false);
        setIsSubmitted(true);
        showNotification({
          title: "Success",
          message: 'Message sent! We will get back to you shortly.',
          color: "green",
        });
      }
    } catch (error: any) {
      setIsLoading(false);
      showNotification({
        title: "Error",
        message: error.message || 'Failed to send message.',
        color: "red",
      });
    }
  };

  return (
    <Container size="sm" style={{ marginTop: '40px' }}>
      <Title ta="center" style={{ marginBottom: '20px' }}>Contact Us</Title>
      {isSubmitted ?
        <Text ta="center" mb={20}>
          Thank you for contacting us! We will get back to you shortly.
        </Text> :
        <Box component="form" onSubmit={handleSubmit}>
          <TextInput
            label="Your Name"
            placeholder="John Doe"
            required
            style={{ marginBottom: '20px' }}
            value={formData.name}
            name="name"
            onChange={handleChange}
          />
          <TextInput
            label="Email Address"
            placeholder="example@mail.com"
            required
            style={{ marginBottom: '20px' }}
            type="email"
            value={formData.email}
            name="email"
            onChange={handleChange}
          />
          <Textarea
            label="Your Message"
            placeholder="Your message here..."
            required
            minRows={3}
            style={{ marginBottom: '20px' }}
            value={formData.message}
            name="message"
            onChange={handleChange}
          />
          <Button fullWidth disabled={isLoading} type="submit">
            Send Message
          </Button>
        </Box>
      }
    </Container>
  );
}