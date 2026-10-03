import Badge from '../common/Badge.jsx';

const tones = {
  new: 'neutral',
  submitted: 'neutral',
  to_review: 'warning',
  reviewing: 'warning',
  in_evaluation: 'warning',
  shortlisted: 'success',
  selected: 'success',
  interview: 'success',
  rejected: 'danger'
};

export default function StatusBadge({ status }) {
  return <Badge tone={tones[status] || 'neutral'}>{status}</Badge>;
}

