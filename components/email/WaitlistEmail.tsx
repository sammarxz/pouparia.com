import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Text,
  Button,
  Section,
} from "@react-email/components";
import * as React from "react";

interface WaitlistEmailProps {
  userEmail?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "https://pouparia.com";

export const WaitlistEmail = ({ userEmail }: WaitlistEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to Pouparia Waitlist! 🎉</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoContainer}>
          <Img src={`/logo.svg`} width="42" height="42" alt="Pouparia Logo" />
        </Section>

        <Heading style={h1} className="text-left">
          Welcome to Pouparia! 🎉
        </Heading>

        <Text style={text}>
          Thank you for joining our waitlist! We're thrilled to have you as part
          of our growing community of people interested in taking control of
          their finances.
        </Text>

        <Section style={boxContainer}>
          <Text style={boxText}>
            <strong style={highlight}>What's next?</strong>
            <br />
            We're working hard to build the best personal finance tool, and
            you'll be among the first to know when we launch. Stay tuned for
            exclusive updates and early access opportunities!
          </Text>
        </Section>

        <Button style={button} href={baseUrl}>
          Visit Pouparia
        </Button>

        <Text style={followText}>Follow our progress:</Text>

        <Section style={socialLinks}>
          <Link href="https://github.com/sammarxz/pouparia" style={socialLink}>
            GitHub
          </Link>
          <Link href="https://twitter.com/pouparia" style={socialLink}>
            Twitter
          </Link>
          <Link href="https://discord.gg/pouparia" style={socialLink}>
            Discord
          </Link>
        </Section>

        <Text style={footer}>
          This email was sent to {userEmail}
          <br />© 2024 Pouparia. All rights reserved.
        </Text>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

const container = {
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "560px",
};

const logoContainer = {
  marginBottom: "24px",
  textAlign: "center" as const,
};

const h1 = {
  color: "#1a1a1a",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "30px 0",
  padding: "0" as const,
};

const text = {
  color: "#444",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "16px 0",
};

const boxContainer = {
  background: "#f9f9f9",
  borderRadius: "8px",
  margin: "24px 0",
  padding: "24px",
};

const boxText = {
  color: "#444",
  fontSize: "15px",
  lineHeight: "22px",
  margin: "0",
};

const highlight = {
  color: "#111",
  fontSize: "16px",
};

const button = {
  backgroundColor: "#22c55e",
  borderRadius: "8px",
  color: "#000",
  display: "inline-block",
  fontSize: "16px",
  fontWeight: "bold",
  padding: "12px 24px",
  textDecoration: "none",
  textAlign: "center" as const,
  margin: "24px 0",
  width: "100%",
};

const followText = {
  color: "#666",
  fontSize: "14px",
  margin: "24px 0 8px",
  textAlign: "center" as const,
};

const socialLinks = {
  textAlign: "center" as const,
};

const socialLink = {
  color: "#444",
  fontSize: "14px",
  margin: "0 8px",
  textDecoration: "underline",
};

const footer = {
  color: "#888",
  fontSize: "12px",
  lineHeight: "20px",
  marginTop: "32px",
  textAlign: "center" as const,
};

export default WaitlistEmail;
