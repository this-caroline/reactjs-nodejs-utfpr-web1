const useYupValidationResolver = (schema) => async (data) => {
  try {
    const values = await schema.validate(data, {
      abortEarly: false
    });

    return { values, errors: {} };
  } catch (errors) {
    return {
      values: {},
      errors: errors.inner.reduce(
        (allErrors, currentError) => ({
          ...allErrors,
          [currentError.path]: {
            type: currentError.type ?? 'validation',
            message: currentError.message
          }
        }), {}
      )
    };
  }
};

export default useYupValidationResolver;
