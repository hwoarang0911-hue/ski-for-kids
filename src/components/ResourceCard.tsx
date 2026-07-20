import type { LearningResource } from '../data/resources';

export function ResourceCard({ resource }: { resource: LearningResource }) {
  return (
    <a className="resource-card" href={resource.url} target="_blank" rel="noopener noreferrer">
      {resource.youtubeId && (
        <img
          className="resource-thumb"
          src={`https://img.youtube.com/vi/${resource.youtubeId}/hqdefault.jpg`}
          alt=""
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      )}
      <div className="resource-body">
        <div className="resource-meta">
          <span className="resource-type">{resource.type}</span>
          <span className="resource-lang">{resource.language}</span>
        </div>
        <h4 className="resource-title">{resource.title}</h4>
        <p className="resource-summary">{resource.summary}</p>
      </div>
    </a>
  );
}
