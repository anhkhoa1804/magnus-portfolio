import { NextResponse } from 'next/server';
import { cacheWrap } from '@/lib/cache';

const WORDS = [
  { word: 'Serendipity', definition: 'The occurrence of events by chance in a happy or beneficial way.', pronunciation: '/ˌserənˈdipitē/', example: 'It was pure serendipity that we met at the coffee shop that day.' },
  { word: 'Ephemeral', definition: 'Lasting for a very short time; transitory.', pronunciation: '/əˈfem(ə)rəl/', example: 'The beauty of cherry blossoms is ephemeral, lasting only a few weeks.' },
  { word: 'Resilience', definition: 'The capacity to recover quickly from difficulties; toughness.', pronunciation: '/rəˈzilyəns/', example: 'Her resilience in the face of adversity inspired everyone around her.' },
  { word: 'Ubiquitous', definition: 'Present, appearing, or found everywhere.', pronunciation: '/yo͞oˈbikwətəs/', example: 'Smartphones have become ubiquitous in modern society.' },
  { word: 'Anomaly', definition: 'Something that deviates from what is standard, normal, or expected.', pronunciation: '/əˈnäməlē/', example: 'The test results showed an anomaly that required further investigation.' },
  { word: 'Paradigm', definition: 'A typical example or pattern of something; a model.', pronunciation: '/ˈperəˌdīm/', example: 'The new theory represents a paradigm shift in scientific thinking.' },
  { word: 'Cognizant', definition: 'Having knowledge or being aware of something.', pronunciation: '/ˈkäɡnəzənt/', example: 'We must be cognizant of the environmental impact of our actions.' },
  { word: 'Eloquent', definition: 'Fluent or persuasive in speaking or writing.', pronunciation: '/ˈeləkwənt/', example: 'The speaker gave an eloquent presentation that moved the audience.' },
  { word: 'Luminary', definition: 'A person who inspires or influences others, especially in a particular field.', pronunciation: '/ˈlo͞oməˌnerē/', example: 'She was a luminary in the field of artificial intelligence.' },
  { word: 'Meticulous', definition: 'Showing great attention to detail; very careful and precise.', pronunciation: '/məˈtikyələs/', example: 'The architect was meticulous in planning every aspect of the building.' },
  { word: 'Sonder', definition: 'The realisation that each passerby has a vivid and complex life as vivid as one\'s own.', pronunciation: '/ˈsändər/', example: 'Walking through the crowd, he felt a sudden sonder.' },
  { word: 'Liminal', definition: 'Occupying a position at, or on both sides of, a boundary or threshold.', pronunciation: '/ˈliminl/', example: 'The airport is a liminal space between departure and arrival.' },
  { word: 'Solipsism', definition: 'The view that the self is the only thing that can be known to exist.', pronunciation: '/ˈsäləpˌsizəm/', example: 'His philosophy bordered on solipsism.' },
  { word: 'Laconic', definition: 'Using very few words; brief and concise.', pronunciation: '/ləˈkänik/', example: 'His laconic reply told us all we needed to know.' },
  { word: 'Petrichor', definition: 'The pleasant smell that frequently accompanies the first rain after a long dry period.', pronunciation: '/ˈpetrɪkɔː/', example: 'After the drought, the petrichor was intoxicating.' },
];

const ONE_DAY_MS = 1000 * 60 * 60 * 24;

function getDailyWord() {
  const today = new Date();
  const start = new Date(today.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((today.getTime() - start.getTime()) / ONE_DAY_MS);
  return WORDS[dayOfYear % WORDS.length];
}

async function fetchLiveDefinition(wordEntry: typeof WORDS[0]) {
  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${wordEntry.word.toLowerCase()}`;
  const res = await fetch(url, { next: { revalidate: 86400 } });
  if (!res.ok) throw new Error(`Dictionary API returned ${res.status}`);
  const data = await res.json();
  const entry = data[0];
  const phonetic = entry.phonetics?.find((p: { text?: string }) => p.text)?.text ?? wordEntry.pronunciation;
  const meaning = entry.meanings?.[0]?.definitions?.[0];
  return {
    word: wordEntry.word,
    definition: meaning?.definition ?? wordEntry.definition,
    pronunciation: phonetic,
    example: meaning?.example ?? wordEntry.example,
  };
}

export async function GET() {
  try {
    const wordEntry = getDailyWord();
    const dateStr = new Date().toISOString().split('T')[0];
    const cacheKey = `word-of-day:${dateStr}`;

    const { value: word } = await cacheWrap(cacheKey, ONE_DAY_MS, () =>
      fetchLiveDefinition(wordEntry).catch(() => ({
        word: wordEntry.word,
        definition: wordEntry.definition,
        pronunciation: wordEntry.pronunciation,
        example: wordEntry.example,
      }))
    );

    return NextResponse.json({ success: true, word, date: dateStr });
  } catch (error) {
    console.error('Word of the Day API error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch word of the day' }, { status: 500 });
  }
}
