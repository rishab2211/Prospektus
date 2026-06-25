"use client";

import Link from "next/link";
import {
  Video,
  BarChart3,
  Share2,
  Zap,
  ArrowRight,
  CheckCircle2,
  Play,
  MousePointerClick,
  TrendingUp,
  Users,
} from "lucide-react";
import { navLinks } from "@/components/LandingPage/navbar.";

const features = [
  {
    icon: Video,
    title: "Record in seconds",
    desc: "Open the desktop app, hit record, and create personalized videos without any setup or complicated workflows.",
  },
  {
    icon: Share2,
    title: "Share with a link",
    desc: "Every video gets a unique link. Drop it into an email, DM, or LinkedIn message — your prospect clicks and watches instantly.",
  },
  {
    icon: BarChart3,
    title: "Track everything",
    desc: "Know exactly who watched, how long they stayed, and when they dropped off. Real data, not guesswork.",
  },
  {
    icon: Zap,
    title: "Close deals faster",
    desc: "Personalized videos get 3x more replies than plain text. Stand out in crowded inboxes and move prospects to action.",
  },
];

const stats = [
  { value: "3x", label: "higher reply rates" },
  { value: "68%", label: "open rate on video emails" },
  { value: "40%", label: "shorter sales cycles" },
];

const steps = [
  {
    num: "01",
    icon: MousePointerClick,
    title: "Install & Record",
    desc: "Download the desktop app. Click record, say your prospect's name, and talk like a human.",
  },
  {
    num: "02",
    icon: Play,
    title: "Send & Share",
    desc: "Grab the auto-generated link. Paste it into your outreach email or message. Done.",
  },
  {
    num: "03",
    icon: TrendingUp,
    title: "Track & Close",
    desc: "See who watched, follow up at the right moment, and turn views into meetings.",
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    desc: "For individuals getting started with video outreach.",
    features: [
      "5 videos per month",
      "Basic analytics",
      "Share links",
      "720p recording",
    ],
    cta: "Start Free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/mo",
    desc: "For sales reps who want to stand out and close more.",
    features: [
      "Unlimited videos",
      "Advanced analytics",
      "Custom branding",
      "1080p recording",
      "CRM integrations",
      "Priority support",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Team",
    price: "$79",
    period: "/mo",
    desc: "For teams that need collaboration and shared insights.",
    features: [
      "Everything in Pro",
      "5 team seats",
      "Shared video library",
      "Team analytics dashboard",
      "Admin controls",
      "Dedicated onboarding",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export default function LandingPage() {
  return (
    <div className="bg-[#0a0a0f] text-white overflow-hidden">
      {/* ──── Hero ──── */}
      <section className="relative min-h-[100dvh] flex items-center">
        {/* Background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[15%] -left-[10%] w-[500px] h-[500px] rounded-full bg-violet-600/[0.07] blur-[150px]" />
          <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] rounded-full bg-indigo-600/[0.05] blur-[130px]" />
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-20 lg:pt-40 lg:pb-28 w-full">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/[0.08] border border-violet-500/[0.15] mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              <span className="text-[13px] text-violet-300/90 font-medium">
                Currently in building phase
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-[clamp(2.5rem,6vw,4.25rem)] leading-[1.08] font-bold tracking-tight">
              Stop sending cold emails{" "}
              <span className="text-gray-500">nobody reads.</span>
            </h1>

            <p className="mt-6 text-lg lg:text-xl text-gray-400 leading-relaxed max-w-lg">
              Record quick, personalized videos and send them to prospects who
              actually want to hear from you. Track opens, watch time, and follow
              up when it matters.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/sign-up"
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 text-[15px] font-medium text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl hover:from-violet-500 hover:to-indigo-500 shadow-xl shadow-violet-600/20 hover:shadow-violet-500/30 transition-all duration-300"
              >
                Get Started — it&apos;s free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-[15px] text-gray-400 hover:text-white border border-white/[0.08] hover:border-white/[0.15] rounded-xl hover:bg-white/[0.03] transition-all duration-200"
              >
                <Play className="w-4 h-4" />
                See how it works
              </Link>
            </div>

            {/* Social proof */}
            <div className="mt-14 flex items-center gap-4">
              <div className="flex -space-x-2.5">
                {[
                  "bg-violet-500",
                  "bg-indigo-500",
                  "bg-fuchsia-500",
                  "bg-blue-500",
                ].map((color, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full ${color} border-2 border-[#0a0a0f] flex items-center justify-center`}
                  >
                    <Users className="w-3.5 h-3.5 text-white/80" />
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500">
                <span className="text-gray-300 font-medium">200+</span> sales
                reps already using Prospektus
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ──── Stats ──── */}
      <section className="relative border-y border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 lg:gap-16">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-4xl lg:text-5xl font-bold bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="mt-2 text-[15px] text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──── Features ──── */}
      <section id="about" className="relative py-24 lg:py-32">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/[0.04] rounded-full blur-[160px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-lg mb-16">
            <p className="text-sm font-medium text-violet-400 mb-3 tracking-wide uppercase">
              Features
            </p>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">
              Everything you need to sell with video
            </h2>
            <p className="mt-4 text-gray-400 text-lg leading-relaxed">
              No bloated features. Just the tools that actually help you book
              more meetings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="group p-7 rounded-2xl border border-white/[0.05] bg-white/[0.015] hover:bg-white/[0.03] hover:border-white/[0.08] transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-violet-500/[0.08] flex items-center justify-center mb-5 group-hover:bg-violet-500/[0.12] transition-colors duration-300">
                  <f.icon className="w-5 h-5 text-violet-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {f.title}
                </h3>
                <p className="text-[15px] text-gray-500 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──── How It Works ──── */}
      <section id="how-it-works" className="relative py-24 lg:py-32 border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-lg mb-16">
            <p className="text-sm font-medium text-violet-400 mb-3 tracking-wide uppercase">
              How it works
            </p>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">
              Three steps. No learning curve.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.num} className="relative">
                <span className="text-6xl font-bold text-white/[0.03] absolute -top-4 -left-2 select-none pointer-events-none">
                  {step.num}
                </span>
                <div className="relative pt-6">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/[0.08] flex items-center justify-center mb-5">
                    <step.icon className="w-5 h-5 text-violet-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-[15px] text-gray-500 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──── Pricing ──── */}
      <section id="pricing" className="relative py-24 lg:py-32 border-t border-white/[0.04]">
        <div className="absolute bottom-0 left-[20%] w-[500px] h-[500px] bg-violet-600/[0.04] rounded-full blur-[160px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-lg mb-16">
            <p className="text-sm font-medium text-violet-400 mb-3 tracking-wide uppercase">
              Pricing
            </p>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">
              Simple pricing, no surprises
            </h2>
            <p className="mt-4 text-gray-400 text-lg leading-relaxed">
              Start free, upgrade when you&apos;re ready.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative p-7 rounded-2xl border transition-all duration-300 ${
                  plan.highlighted
                    ? "border-violet-500/30 bg-violet-500/[0.04] shadow-lg shadow-violet-500/[0.05]"
                    : "border-white/[0.05] bg-white/[0.015] hover:bg-white/[0.03] hover:border-white/[0.08]"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-7">
                    <span className="px-3 py-1 text-[11px] font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full uppercase tracking-wider">
                      Popular
                    </span>
                  </div>
                )}

                <p className="text-[15px] font-medium text-gray-300">
                  {plan.name}
                </p>
                <div className="mt-4 mb-2 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-gray-500 text-[15px]">{plan.period}</span>
                  )}
                </div>
                <p className="text-[14px] text-gray-500 mb-6">{plan.desc}</p>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
                      <span className="text-[14px] text-gray-400">{feat}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/sign-up"
                  className={`block text-center px-5 py-3 text-[14px] font-medium rounded-xl transition-all duration-300 ${
                    plan.highlighted
                      ? "text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30"
                      : "text-gray-300 border border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.03]"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──── CTA ──── */}
      <section className="relative py-24 lg:py-32 border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-lg">
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">
              Ready to ditch the cold emails?
            </h2>
            <p className="mt-4 text-gray-400 text-lg leading-relaxed">
              Join hundreds of sales reps who are booking more meetings with
              personalized video outreach. Free to start, no credit card needed.
            </p>
            <div className="mt-8">
              <Link
                href="/sign-up"
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 text-[15px] font-medium text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl hover:from-violet-500 hover:to-indigo-500 shadow-xl shadow-violet-600/20 hover:shadow-violet-500/30 transition-all duration-300"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ──── Contact ──── */}
      <section id="contact" className="relative py-24 lg:py-32 border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="max-w-md">
              <p className="text-sm font-medium text-violet-400 mb-3 tracking-wide uppercase">
                Contact
              </p>
              <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">
                Let&apos;s talk
              </h2>
              <p className="mt-4 text-gray-400 text-lg leading-relaxed">
                Have questions about Prospektus? Want a demo for your team?
                Reach out and we&apos;ll get back to you within 24 hours.
              </p>
              <div className="mt-8 space-y-4">
                <a
                  href="mailto:rishabraj2211@gmail.com"
                  className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                    <span className="text-sm">✉</span>
                  </div>
                  <span className="text-[15px]">rishabraj2211@gmail.com</span>
                </a>
              </div>
            </div>

            {/* <div>
              <form
                className="space-y-5"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-[13px] font-medium text-gray-400 mb-2"
                    >
                      Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      placeholder="Your name"
                      className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-3 text-[14px] text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/30 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-[13px] font-medium text-gray-400 mb-2"
                    >
                      Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      placeholder="you@company.com"
                      className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-3 text-[14px] text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/30 transition-all duration-200"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-[13px] font-medium text-gray-400 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    placeholder="Tell us what you need..."
                    className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-3 text-[14px] text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/30 transition-all duration-200 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 text-[14px] font-medium text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 transition-all duration-300"
                >
                  Send Message
                </button>
              </form>
            </div> */}
          </div>
        </div>
      </section>

      {/* ──── Footer ──── */}
      <footer className="border-t border-white/[0.04] py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold text-xs">P</span>
              </div>
              <span className="text-sm font-medium text-gray-500">
                Prospektus
              </span>
            </div>
            <div className="flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-[13px] text-gray-600 hover:text-gray-400 transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <p className="text-[13px] text-gray-700">
              © {new Date().getFullYear()} Prospektus
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}