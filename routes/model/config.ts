interface Config {
    mandatoryKeys: string[];
    keyMappings: { [key: string]: string };
    transformConfig: { [key: string]: TransformConfig[] };
    newKeys: { [key: string]: any };
    repeatKeys: { [key: string]: any };
  }