export const validatePostInput = (title, description, type, mediaUrl) => {
  const errors = [];

  if (!title || title.trim().length < 3) {
    errors.push('Title must be at least 3 characters');
  }

  if (title && title.length > 200) {
    errors.push('Title must not exceed 200 characters');
  }

  if (description && description.length > 5000) {
    errors.push('Description must not exceed 5000 characters');
  }

  if (!type || !['IMAGE', 'VIDEO'].includes(type)) {
    errors.push('Type must be IMAGE or VIDEO');
  }

  if (!mediaUrl) {
    errors.push('Media URL is required');
  }

  return { valid: errors.length === 0, errors };
};

export const validateCommentInput = (content) => {
  const errors = [];

  if (!content || content.trim().length < 1) {
    errors.push('Comment cannot be empty');
  }

  if (content && content.length > 1000) {
    errors.push('Comment must not exceed 1000 characters');
  }

  return { valid: errors.length === 0, errors };
};
