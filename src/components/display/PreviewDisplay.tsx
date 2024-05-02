import { Container, Paper, Title } from '@mantine/core';
import DOMPurify from 'dompurify';

interface PreviewDisplayProps {
  htmlContent: string;
}

const PreviewDisplay: React.FC<PreviewDisplayProps> = ({ htmlContent }) => {
  // Sanitize the HTML content
  const safeHTML = DOMPurify.sanitize(htmlContent);

  return (
    <Container>
      <Title c='dark' mb='8'>
        Preview Text
      </Title>
      <Paper shadow='xs' p='md' style={{ minHeight: '200px' }}>
        <div dangerouslySetInnerHTML={{ __html: safeHTML }} />
      </Paper>
    </Container>
  );
};

export default PreviewDisplay;
