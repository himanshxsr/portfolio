"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/animations/PageTransition";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { personalData } from "@/data/personal";
import { Send, CheckCircle, Mail } from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";

export default function ContactPage() {
  const [formState, setFormState] = useState<"idle" | "sending" | "sent">("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("sending");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "",
          name: formData.name,
          email: formData.email,
          message: formData.message,
          subject: `Portfolio Contact: ${formData.name}`,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setFormState("sent");

        // Send themed auto-reply email
        fetch("/api/auto-reply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: formData.name, email: formData.email }),
        }).catch(() => {}); // Fire and forget

        setFormData({ name: "", email: "", message: "" });
      } else {
        setFormState("idle");
      }
    } catch {
      setFormState("idle");
    }

    setTimeout(() => setFormState("idle"), 3000);
  };

  const socialLinks = [
    { icon: FaGithub, href: personalData.social.github, label: "GitHub" },
    { icon: FaLinkedinIn, href: personalData.social.linkedin, label: "LinkedIn" },
    { icon: Mail, href: `mailto:${personalData.social.email}`, label: "Email" },
  ];

  return (
    <PageTransition>
      <section className="min-h-screen py-20 px-6 dot-grid">
        <div className="mx-auto max-w-4xl">
          <SectionHeader
            number="05"
            title="Get In Touch"
            subtitle="Have a project in mind? Let's build something together."
          />

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <ScrollReveal direction="left">
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-text-primary mb-4">
                    Let&apos;s connect
                  </h3>
                  <p className="text-text-secondary font-body leading-relaxed">
                    I&apos;m always open to discussing new projects, creative ideas,
                    or opportunities to be part of your vision. Drop me a message
                    and I&apos;ll get back to you as soon as possible.
                  </p>
                </div>

                {/* Social Links */}
                <div className="space-y-4">
                  {socialLinks.map((social, i) => (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 rounded-xl bg-surface border border-border-subtle hover:border-primary/20 transition-all group"
                      whileHover={{ x: 4 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-background transition-colors">
                        <social.icon size={20} />
                      </div>
                      <span className="text-text-secondary group-hover:text-text-primary transition-colors font-medium">
                        {social.label}
                      </span>
                    </motion.a>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Contact Form */}
            <ScrollReveal direction="right">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="peer w-full px-4 py-3 bg-surface border border-border-subtle rounded-xl text-text-primary placeholder-transparent focus:outline-none focus:border-primary/50 transition-colors"
                    placeholder="Name"
                  />
                  <label
                    htmlFor="name"
                    className="absolute left-4 -top-2.5 text-xs font-mono text-primary bg-background px-1 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-text-secondary peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-primary"
                  >
                    Name
                  </label>
                </div>

                {/* Email Field */}
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    className="peer w-full px-4 py-3 bg-surface border border-border-subtle rounded-xl text-text-primary placeholder-transparent focus:outline-none focus:border-primary/50 transition-colors"
                    placeholder="Email"
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-4 -top-2.5 text-xs font-mono text-primary bg-background px-1 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-text-secondary peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-primary"
                  >
                    Email
                  </label>
                </div>

                {/* Message Field */}
                <div className="relative">
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    required
                    rows={5}
                    className="peer w-full px-4 py-3 bg-surface border border-border-subtle rounded-xl text-text-primary placeholder-transparent focus:outline-none focus:border-primary/50 transition-colors resize-none"
                    placeholder="Message"
                  />
                  <label
                    htmlFor="message"
                    className="absolute left-4 -top-2.5 text-xs font-mono text-primary bg-background px-1 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-text-secondary peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-primary"
                  >
                    Message
                  </label>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={formState !== "idle"}
                  className="w-full py-3.5 rounded-xl bg-primary text-background font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-70"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {formState === "idle" && (
                    <>
                      <Send size={18} />
                      Send Message
                    </>
                  )}
                  {formState === "sending" && (
                    <motion.div
                      className="w-5 h-5 border-2 border-background border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  )}
                  {formState === "sent" && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle size={18} />
                      Sent Successfully!
                    </motion.div>
                  )}
                </motion.button>
              </form>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
