import React from 'react';
import { 
  Sparkles, 
  Target, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Lightbulb, 
  Briefcase, 
  Code, 
  FileText,
  Layers,
  ChevronRight,
  Quote
} from 'lucide-react';

/**
 * Parses inline markdown-like syntax (**bold**, *italic*, `code`, quotes)
 * and returns clean formatted JSX without raw asterisks or markdown artifacts.
 */
function renderInlineText(text) {
  if (!text) return null;

  // Split by markdown delimiters (**bold**, `code`, *italic*, "quote")
  const tokens = [];
  let remaining = text;

  // Regex to match **bold**, `code`, *italic*, or normal text
  const regex = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*|"([^"]+)")/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Push preceding normal text
    if (match.index > lastIndex) {
      tokens.push({
        type: 'text',
        content: text.substring(lastIndex, match.index),
      });
    }

    const fullMatch = match[0];
    if (fullMatch.startsWith('**') && fullMatch.endsWith('**')) {
      const inner = fullMatch.slice(2, -2);
      tokens.push({ type: 'bold', content: inner });
    } else if (fullMatch.startsWith('`') && fullMatch.endsWith('`')) {
      const inner = fullMatch.slice(1, -1);
      tokens.push({ type: 'code', content: inner });
    } else if (fullMatch.startsWith('*') && fullMatch.endsWith('*')) {
      const inner = fullMatch.slice(1, -1);
      tokens.push({ type: 'italic', content: inner });
    } else if (fullMatch.startsWith('"') && fullMatch.endsWith('"')) {
      const inner = fullMatch.slice(1, -1);
      tokens.push({ type: 'quote', content: inner });
    }

    lastIndex = regex.lastIndex;
  }

  // Push remaining text
  if (lastIndex < text.length) {
    tokens.push({
      type: 'text',
      content: text.substring(lastIndex),
    });
  }

  return tokens.map((token, idx) => {
    // Check if token content is a special label like "Missing Skills:", "Validated Skills:", etc.
    const cleanContent = token.content.replace(/^[\s\-*●]+/, '');

    if (token.type === 'bold') {
      const lower = cleanContent.toLowerCase();
      if (lower.includes('missing skill') || lower.includes('gap')) {
        return (
          <span key={idx} className="inline-flex items-center gap-1 font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-lg border border-rose-500/20 mr-1.5 my-0.5">
            <AlertCircle className="w-3 h-3 flex-shrink-0" />
            {cleanContent}
          </span>
        );
      }
      if (lower.includes('validated skill') || lower.includes('matched') || lower.includes('strength')) {
        return (
          <span key={idx} className="inline-flex items-center gap-1 font-bold text-[#00f59b] bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20 mr-1.5 my-0.5">
            <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
            {cleanContent}
          </span>
        );
      }
      if (lower.includes('reasoning') || lower.includes('evidence') || lower.includes('context')) {
        return (
          <span key={idx} className="inline-flex items-center gap-1 font-bold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-lg border border-cyan-500/20 mr-1.5 my-0.5">
            <Sparkles className="w-3 h-3 flex-shrink-0" />
            {cleanContent}
          </span>
        );
      }
      if (lower.includes('action plan') || lower.includes('recommendation') || lower.includes('quantify') || lower.includes('placement')) {
        return (
          <span key={idx} className="inline-flex items-center gap-1 font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20 mr-1.5 my-0.5">
            <TrendingUp className="w-3 h-3 flex-shrink-0" />
            {cleanContent}
          </span>
        );
      }
      return (
        <strong key={idx} className="font-bold text-white tracking-tight">
          {cleanContent}
        </strong>
      );
    }

    if (token.type === 'code') {
      return (
        <code key={idx} className="font-mono bg-[#0c1322] text-[#00f59b] px-2 py-0.5 rounded-md border border-emerald-500/20 text-[11px] mx-0.5">
          {token.content}
        </code>
      );
    }

    if (token.type === 'italic') {
      return (
        <span key={idx} className="italic text-slate-300">
          {token.content}
        </span>
      );
    }

    if (token.type === 'quote') {
      return (
        <span key={idx} className="inline-block bg-[#08101d] text-slate-300 px-2.5 py-1 rounded-lg border border-white/10 italic text-[11px] my-1 leading-relaxed">
          "{token.content}"
        </span>
      );
    }

    // Normal text - strip any accidental orphan asterisks or hashes
    const sanitized = token.content.replace(/\*{1,2}/g, '').replace(/#{1,6}\s*/g, '');
    return <span key={idx}>{sanitized}</span>;
  });
}

/**
 * Formats a block of text into structured, clean UI cards with no raw markdown artifacts.
 */
export default function FormattedResponse({ text }) {
  if (!text) return null;

  // Split into lines
  const rawLines = text.split('\n');
  const blocks = [];
  let currentBlock = null;

  for (let i = 0; i < rawLines.length; i++) {
    const rawLine = rawLines[i].trim();
    if (!rawLine) continue;

    // 1. Detect Main Heading (e.g. ### 🎯 Skill Gap & Requirement Analysis)
    if (rawLine.startsWith('#')) {
      const cleanHeading = rawLine.replace(/^[#\s]+/, '').replace(/\*\*/g, '').trim();
      blocks.push({
        type: 'heading',
        text: cleanHeading,
      });
      continue;
    }

    // 2. Detect Numbered Section Headers (e.g. **1. Core Requirements Identified...** or 1. Core...)
    const numberedMatch = rawLine.match(/^(\*{0,2})(\d+)[\.\)]\s*(.*?)\1$/);
    if (numberedMatch) {
      const num = numberedMatch[2];
      const title = numberedMatch[3].replace(/\*\*/g, '').trim();
      blocks.push({
        type: 'numbered-section',
        number: num,
        title: title,
      });
      continue;
    }

    // 3. Detect Bullet points (- item, * item, ● item)
    if (/^[\-\*●]\s+/.test(rawLine)) {
      const cleanBullet = rawLine.replace(/^[\-\*●]\s+/, '').trim();
      blocks.push({
        type: 'bullet',
        text: cleanBullet,
      });
      continue;
    }

    // 4. Default regular paragraph / descriptive line
    blocks.push({
      type: 'paragraph',
      text: rawLine,
    });
  }

  return (
    <div className="space-y-3.5 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
      {blocks.map((block, idx) => {
        if (block.type === 'heading') {
          return (
            <div key={idx} className="flex items-center gap-2.5 pb-2 border-b border-white/10 pt-1">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-[#00f59b] flex-shrink-0 shadow-[0_0_15px_rgba(0,245,155,0.2)]">
                <Target className="w-4 h-4" />
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-white font-outfit tracking-wide">
                {block.text}
              </h3>
            </div>
          );
        }

        if (block.type === 'numbered-section') {
          return (
            <div key={idx} className="pt-2 flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 text-slate-950 font-black text-xs flex items-center justify-center font-outfit shadow-sm flex-shrink-0">
                {block.number}
              </span>
              <h4 className="font-bold text-white text-xs sm:text-sm tracking-tight">
                {block.title}
              </h4>
            </div>
          );
        }

        if (block.type === 'bullet') {
          return (
            <div key={idx} className="flex items-start gap-2.5 pl-3 py-1 bg-[#060b18]/60 rounded-xl border border-white/5 shadow-inner">
              <ChevronRight className="w-3.5 h-3.5 text-[#00f59b] flex-shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">
                {renderInlineText(block.text)}
              </div>
            </div>
          );
        }

        return (
          <p key={idx} className="text-slate-300 leading-relaxed">
            {renderInlineText(block.text)}
          </p>
        );
      })}
    </div>
  );
}
