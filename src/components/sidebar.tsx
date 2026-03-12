"use client";

import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Mail, MapPin, Github, Linkedin, Facebook, Download } from "lucide-react";

const navigation = [
  { name: "About", href: "#about" },
  { name: "Experience", href: "#experience" },
  { name: "Skills", href: "#skills" },
  { name: "Achievements", href: "#achievements" },
  { name: "Education", href: "#education" },
];

const socialLinks = [
  { name: "GitHub", href: "https://github.com/cloud-007", icon: Github },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/-mazharulislam-/", icon: Linkedin },
  { name: "Facebook", href: "https://www.facebook.com/", icon: Facebook },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-80 border-r border-border bg-card p-8 overflow-y-auto">
      {/* Profile Section */}
      <div className="flex flex-col items-center text-center mb-8">
        <Avatar className="w-32 h-32 mb-4 ring-2 ring-primary ring-offset-4 ring-offset-background">
          <AvatarImage src="/images/profile.jpg" alt="Md Mazharul Islam Emon" />
          <AvatarFallback>ME</AvatarFallback>
        </Avatar>
        
        <h1 className="text-2xl font-bold mb-1">Md Mazharul Islam Emon</h1>
        <p className="text-primary font-semibold text-lg mb-2">Senior Software Engineer</p>
        <p className="text-sm text-muted-foreground">LII Lab</p>
      </div>

      <Separator className="my-6" />

      {/* Navigation */}
      <nav className="mb-8">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className="block px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <Separator className="my-6" />

      {/* Contact Info */}
      <div className="space-y-3 mb-8">
        <a
          href="mailto:mie.mazharul@gmail.com"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Mail className="w-4 h-4" />
          <span className="truncate">mie.mazharul@gmail.com</span>
        </a>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>Sylhet, Bangladesh</span>
        </div>
      </div>

      {/* Social Links */}
      <div className="flex gap-2 mb-8">
        {socialLinks.map((social) => (
          <Button
            key={social.name}
            variant="outline"
            size="icon"
            asChild
            className="hover:bg-primary hover:text-primary-foreground"
          >
            <a href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.name}>
              <social.icon className="w-4 h-4" />
            </a>
          </Button>
        ))}
      </div>

      {/* Download Resume Button */}
      <Button className="w-full" size="lg">
        <Download className="w-4 h-4 mr-2" />
        Download Resume
      </Button>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-border">
        <p className="text-xs text-center text-muted-foreground">
          © {new Date().getFullYear()} All rights reserved
        </p>
      </div>
    </aside>
  );
}
