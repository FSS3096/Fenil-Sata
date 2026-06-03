import { FormEvent, useState } from "react";
import { Github, Linkedin, Mail } from "lucide-react";
import { GlassPanel } from "../components/GlassPanel";
import { MagneticButton } from "../components/MagneticButton";
import { SectionHeader } from "../components/SectionHeader";
import { links } from "../data/portfolio";

type FormState = {
  name: string;
  email: string;
  message: string;
};

export function ContactSection() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    message: ""
  });
  const [status, setStatus] = useState("");

  const update = (key: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus("Please fill all fields before launching the signal.");
      return;
    }

    const subject = encodeURIComponent(`Portfolio inquiry from ${form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
    );

    setStatus("Opening your email client.");
    window.location.href = `mailto:${links.email}?subject=${subject}&body=${body}`;
  };

  return (
    <section className="section contact-section" id="contact">
      <div className="contact-grid">
        <div>
          <SectionHeader
            index="08"
            label="Contact"
            title="If something I built or wrote made you think, let's talk."
            copy="Founder-office roles, product internships, research collaborations, and sharp product conversations are welcome."
          />
          <div className="contact-socials" data-gsap-reveal>
            <a href={`mailto:${links.email}`}>
              <Mail size={18} aria-hidden />
              {links.email}
            </a>
            <a href={links.linkedin} target="_blank" rel="noreferrer">
              <Linkedin size={18} aria-hidden />
              LinkedIn
            </a>
            <a href={links.github} target="_blank" rel="noreferrer">
              <Github size={18} aria-hidden />
              GitHub
            </a>
          </div>
        </div>

        <GlassPanel as="form" className="contact-form" onSubmit={submit} data-gsap-reveal>
          <label>
            Name
            <input
              value={form.name}
              onChange={(event) => update("name", event.target.value)}
              placeholder="Your name"
              autoComplete="name"
            />
          </label>
          <label>
            Email
            <input
              value={form.email}
              onChange={(event) => update("email", event.target.value)}
              placeholder="you@example.com"
              type="email"
              autoComplete="email"
            />
          </label>
          <label>
            Message
            <textarea
              value={form.message}
              onChange={(event) => update("message", event.target.value)}
              placeholder="Tell me what you are building or hiring for."
              rows={5}
            />
          </label>
          <MagneticButton type="submit" showArrow>
            Send signal
          </MagneticButton>
          {status ? <p className="form-status">{status}</p> : null}
        </GlassPanel>
      </div>
    </section>
  );
}
