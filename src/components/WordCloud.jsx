import { useEffect, useState } from 'react';
import { Wordcloud } from '@visx/wordcloud';

const defaultStopWords = new Set([
    'the', 'and', 'is', 'to', 'of', 'in', 'a', 'for', 'it', 'on', 'at',
    'with', 'was', 'as', 'i', 'had', 'my', 'we', 'but', 'so', 'this',
    'that', 'just', 'be', 'get', 'got', 'some', 'more', 'were', 'am',
    'are', 'have', 'has', 'you', 'your', 'from', 'not', 'they', 'them',
    'their', 'its', 'our', 'out', 'by', 'do', 'did', 'does', 'will', 'would',
    'can', 'could', 'should', 'also', 'been', 'then', 'than', 'an', 'if',
    'or', 'when', 'what', 'which', 'who', 'how', 'all', 'any', 'each', 'no',
    'up', 'down', 'again', 'off', 'over', 'under', 'because', 'about', 'into',
    'too', 'very', 'even', 'while', 'before', 'after', 'once'
  ]);
  

function buildWordFreqs(textArray, stopWords = defaultStopWords) {
  const allText = textArray.join(' ').toLowerCase();
  const words = allText.match(/\b\w+\b/g) || [];
  const freqs = {};

  words.forEach((word) => {
    if (!stopWords.has(word) && word.length > 2) {
      freqs[word] = (freqs[word] || 0) + 1;
    }
  });

  return Object.entries(freqs)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 100)
    .map(([text, value]) => ({ text, value }));
}

export default function WordCloudComponent({ textArray = [], width = 600, height = 400 }) {
  const [words, setWords] = useState([]);

  useEffect(() => {
    const freqs = buildWordFreqs(textArray);
    setWords(freqs);
  }, [textArray]);

  return (
    <div className="overflow-x-auto">
      <svg width={width} height={height}>
        <Wordcloud
          words={words}
          width={width}
          height={height}
          font="Inter"
          fontWeight="bold"
          fontSize={(d) => Math.sqrt(d.value) * 10}
          spiral="archimedean"
          rotate={() => ~~(Math.random() * 2) * 90}
          padding={2}
        >
          {(cloudWords) =>
            cloudWords.map((word, i) => (
              <text
                key={i}
                transform={`translate(${word.x}, ${word.y}) rotate(${word.rotate})`}
                fontSize={word.size}
                fontFamily="Inter"
                fontWeight="bold"
                textAnchor="middle"
                fill="#3B82F6"
              >
                {word.text}
              </text>
            ))
          }
        </Wordcloud>
      </svg>
    </div>
  );
}
