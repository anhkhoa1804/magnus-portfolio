import { NextRequest, NextResponse } from 'next/server';

const SUPPORTED_LANGUAGES = ['python', 'javascript', 'cpp', 'java'];

export async function POST(req: NextRequest) {
  try {
    const { code, language, stdin } = await req.json();

    if (!code || !language) {
      return NextResponse.json(
        { success: false, error: 'Code and language are required' },
        { status: 400 }
      );
    }

    const lang = language.toLowerCase();
    if (!SUPPORTED_LANGUAGES.includes(lang)) {
      return NextResponse.json(
        { success: false, error: `Unsupported language: ${language}` },
        { status: 400 }
      );
    }

    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'No execution backend configured' },
        { status: 503 }
      );
    }

    const startTime = Date.now();

    const systemPrompt =
      'You are a precise code interpreter. Execute the given code mentally and return ONLY the exact stdout output — nothing else. ' +
      'No explanations, no markdown, no code blocks. If the code raises an error, return only the error message as it would appear in stderr.';

    const userPrompt = stdin
      ? `Execute this ${lang} code with stdin:\n\`${stdin}\`\n\n\`\`\`${lang}\n${code}\n\`\`\``
      : `Execute this ${lang} code:\n\`\`\`${lang}\n${code}\n\`\`\``;

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0,
        max_tokens: 512,
      }),
    });

    if (!groqRes.ok) throw new Error(`Groq API error: ${groqRes.status}`);

    const groqData = await groqRes.json();
    const output = groqData.choices?.[0]?.message?.content ?? '';
    const executionTime = ((Date.now() - startTime) / 1000).toFixed(3);

    // Heuristic: if output looks like a traceback/error, mark as Runtime Error
    const isError =
      /^(Traceback|Error|Exception|SyntaxError|TypeError|ValueError|NameError)/m.test(output);

    return NextResponse.json({
      success: true,
      output: isError ? '' : output,
      stderr: isError ? output : '',
      compile_output: '',
      status: isError ? 'Runtime Error' : 'Accepted',
      time: executionTime,
      memory: 0,
      language,
    });
  } catch (error: any) {
    console.error('Code execution error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Execution failed' },
      { status: 500 }
    );
  }
}

