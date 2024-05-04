import { getStrength } from "@/utils/text-helper";
import { Box, Center, Group, PasswordInput, Progress, Text } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";

interface PasswordProps {
  password: string;
  setPassword: (password: string) => void;
}

export default function Password({ password, setPassword }: PasswordProps) {

  function PasswordRequirement({
    meets,
    label,
  }: {
    meets: boolean;
    label: string;
  }) {
    return (
      <Text component='div' c={meets ? 'teal' : 'red'} mt={5} size='sm'>
        <Center inline>
          {meets ? (
            <IconCheck size='0.9rem' stroke={1.5} />
          ) : (
            <IconX size='0.9rem' stroke={1.5} />
          )}
          <Box ml={7}>{label}</Box>
        </Center>
      </Text>
    );
  }

  const requirements = [
    { re: /[0-9]/, label: 'Includes number' },
    { re: /[a-z]/, label: 'Includes lowercase letter' },
    { re: /[A-Z]/, label: 'Includes uppercase letter' },
    { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Includes special symbol' },
  ];

  const strength = getStrength(password, requirements);
  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement
      key={index}
      label={requirement.label}
      meets={requirement.re.test(password)}
    />
  ));
  const bars = Array(4)
    .fill(0)
    .map((_, index) => (
      <Progress
        styles={{ section: { transitionDuration: '0ms' } }}
        value={
          password.length > 0 && index === 0
            ? 100
            : strength >= ((index + 1) / 4) * 100
              ? 100
              : 0
        }
        color={strength > 80 ? 'teal' : strength > 50 ? 'yellow' : 'red'}
        key={index}
        size={4}
      />
    ));

  return <div>
    <PasswordInput
      value={password}
      onChange={(event) => setPassword(event.currentTarget.value)}
      placeholder='Your password'
      label='Password'
      required
      miw={300}
    />

    <Group gap={5} grow mt='xs' mb='md'>
      {bars}
    </Group>

    <PasswordRequirement
      label='Has at least 6 characters'
      meets={password.length > 5}
    />
    {checks}
  </div>
}