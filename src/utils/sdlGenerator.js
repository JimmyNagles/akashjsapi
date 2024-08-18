function generateSDL(dockerImage, cpu, memory, storage) {
  return `
  version: "2.0"
  
  services:
    web:
      image: ${dockerImage}
      expose:
        - port: 3000
          as: 80
          to:
            - global: true
  
  profiles:
    compute:
      web:
        resources:
          cpu:
            units: ${cpu}
          memory:
            size: ${memory}
          storage:
            size: ${storage}
  
    placement:
      dcloud:
        pricing:
          web:
            denom: uakt
            amount: 1000
  
  deployment:
    web:
      dcloud:
        profile: web
        count: 1
  `;
}

module.exports = { generateSDL };
