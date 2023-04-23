function transformArray(inputArray, config) {
  const { outputModel, fieldMappings, groupingSpec, arrayKeySpecs, mergeKeys } = config;

  const outputArray = inputArray.map((inputObj) => {
    // Rename fields
    const outputObj = {};
    Object.entries(inputObj).forEach(([inputKey, inputValue]) => {
      const mapping = fieldMappings.find((m) => m.inputKey === inputKey);
      const outputKey = mapping ? mapping.outputKey : inputKey;
      const config = mapping ? mapping.config : undefined;
      let outputValue = inputValue;
      if (config) {
        if (config.split && inputValue != undefined) {
          outputValue = String(inputValue).split(config.split);
        }
        if (config.trim) {
          if (Array.isArray(outputValue)) {
            outputValue = outputValue.map((v) => v.trim());
          } else if (outputValue != undefined) {
            outputValue = String(outputValue).trim();
          }
        }
        if (config.replace) {
          if (Array.isArray(outputValue)) {
            outputValue = outputValue.map((v) =>
              config.replace.reduce((prev, curr) => prev.replace(curr, ''), v)
            );
          } else {
            outputValue = config.replace.reduce(
              (prev, curr) => prev.replace(curr, ''),
              String(outputValue)
            );
          }
        }
      }
      outputObj[outputKey] = outputValue;
    });

    // Add grouping fields
    if (groupingSpec) {
      const { field, spans } = groupingSpec;
      const fieldValue = outputObj[field];
      spans.forEach(([start, end], i) => {
        const key = `${field}_${start}_${end}`;
        outputObj[key] = fieldValue.substring(start, end) || undefined;
      });
    }

    // Add array keys
    if (arrayKeySpecs) {
      arrayKeySpecs.forEach((spec) => {
        outputObj[spec.key] = spec.repeatValue;
      });
    }

    // Merge keys
    if (mergeKeys) {
      mergeKeys.forEach((key) => {
        const valuesToMerge = Object.keys(outputObj)
          .filter((k) => k.startsWith(key))
          .map((k) => outputObj[k])
          .filter((v) => v !== undefined);
        outputObj[key] = valuesToMerge.join('_');
      });
    }

    return outputObj;
  });

  // Rename output fields to match model
  return outputArray.map((outputObj) => {
    const renamedOutputObj = {};
    Object.entries(outputObj).forEach(([outputKey, outputValue]) => {
      const inputKey = Object.keys(outputModel).find((k) => outputModel[k] === outputKey);
      renamedOutputObj[inputKey || outputKey] = outputValue;
    });
    return renamedOutputObj;
  });
}