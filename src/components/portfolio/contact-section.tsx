"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useState } from "react";
import { Mail, MapPin, Send, Loader2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type ContactFormData = {
  name: string;
  email: string;
  subject?: string;
  message: string;
};

const CONTACT_EMAIL = "elnataldebebe@gmail.com";
const CONTACT_LOCATION = "Addis Ababa, Ethiopia";

export function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    mode: "onTouched",
  });

  const onSubmit = async (data: ContactFormData) => {
    const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;
    if (!endpoint) {
      toast.error("Contact form is not configured.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? "Something went wrong.");
      }

      toast.success("Message sent!", {
        description: "Thanks for reaching out. I'll get back to you soon.",
      });
      reset();
    } catch (err) {
      toast.error("Failed to send message", {
        description:
          err instanceof Error ? err.message : "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 relative overflow-hidden">
      {/* Background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-[400px] w-[600px] rounded-full bg-[#7c3aed]/8 blur-[100px]"
      />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <MessageSquare className="size-5 text-[#7c3aed]" />
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7c3aed]">
              Contact
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Get In Touch
          </h2>
          <p className="text-muted-foreground text-base max-w-md mx-auto">
            Have a project in mind? Let&apos;s work together.
          </p>
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#a78bfa]" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Contact info panel */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 glass rounded-xl p-7 space-y-6"
          >
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                Contact Information
              </h3>
              <p className="text-sm text-muted-foreground">
                I&apos;m open to new opportunities and interesting projects.
                Feel free to reach out!
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 group">
                <div className="flex items-center justify-center size-9 rounded-lg bg-[#7c3aed]/10 border border-[#7c3aed]/20 text-[#a78bfa] shrink-0">
                  <Mail className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground mb-0.5">Email</p>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="text-sm text-foreground hover:text-[#a78bfa] transition-colors truncate block"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center size-9 rounded-lg bg-[#7c3aed]/10 border border-[#7c3aed]/20 text-[#a78bfa] shrink-0">
                  <MapPin className="size-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Location</p>
                  <p className="text-sm text-foreground">{CONTACT_LOCATION}</p>
                </div>
              </div>
            </div>

            {/* Decorative gradient bar */}
            <div className="pt-4 border-t border-white/6">
              <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-[#7c3aed] via-[#a78bfa] to-[#c4b5fd] opacity-60" />
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-3 glass rounded-xl p-7"
          >
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
              {/* Name + Email row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">
                    Name <span className="text-[#7c3aed]">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    aria-invalid={!!errors.name}
                    {...register("name", {
                      required: "Name is required",
                      maxLength: { value: 100, message: "Name is too long" },
                    })}
                  />
                  {errors.name && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email">
                    Email <span className="text-[#7c3aed]">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    aria-invalid={!!errors.email}
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Enter a valid email address",
                      },
                    })}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1.5">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Project inquiry, collaboration…"
                  {...register("subject", {
                    maxLength: { value: 200, message: "Subject is too long" },
                  })}
                />
                {errors.subject && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.subject.message}
                  </p>
                )}
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <Label htmlFor="message">
                  Message <span className="text-[#7c3aed]">*</span>
                </Label>
                <Textarea
                  id="message"
                  placeholder="Tell me about your project or how I can help…"
                  rows={5}
                  className="resize-none min-h-[130px]"
                  aria-invalid={!!errors.message}
                  {...register("message", {
                    required: "Message is required",
                    minLength: {
                      value: 10,
                      message: "Message must be at least 10 characters",
                    },
                    maxLength: {
                      value: 2000,
                      message: "Message is too long (max 2000 chars)",
                    },
                  })}
                />
                {errors.message && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.message.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white border-0 glow-hover"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send className="size-4" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
