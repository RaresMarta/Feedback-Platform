type HashtagListProps = {
  hashtags: string[];
  selectedHashtag: string | null;
  handleSelectHashtag: (tag: string) => void;
};

export default function HashtagList({
  hashtags,
  selectedHashtag,
  handleSelectHashtag
}: HashtagListProps) {
  return (
    <ul className="hashtags">
      {hashtags.map(tag => (
        <li key={tag}>
          <button
            className={selectedHashtag === tag ? "active" : ""}
            onClick={() => handleSelectHashtag(tag)}
          >
            {tag}
          </button>
        </li>
      ))}
    </ul>
  );
}
