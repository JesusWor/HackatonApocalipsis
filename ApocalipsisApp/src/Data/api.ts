// export interface SbdbResponse {
//   object: {
//     orbit_id: string;
//     prefix: string | null;
//     neo: boolean;
//     kind: string;
//     pha: boolean;
//     des: string;
//     spkid: string;
//     fullname: string;
//     orbit_class: {
//       code: string;
//       name: string;
//     };
//   };
//   orbit: {
//     n_obs_used: number;
//     data_arc: string;
//     elements: OrbitElement[];
//     cov_epoch: string;
//     last_obs: string;
//     condition_code: string;
//     sb_used: string;
//     soln_date: string;
//     moid_jup: string;
//     comment: string | null;
//     not_valid_before: string | null;
//     orbit_id: string;
//     first_obs: string;
//     not_valid_after: string | null;
//     n_del_obs_used: number | null;
//     two_body: string | null;
//     t_jup: string;
//     rms: string;
//     source: string;
//     equinox: string;
//     n_dop_obs_used: number | null;
//     epoch: string;
//     model_pars: any[]; // vacío en este caso
//     moid: string;
//     producer: string;
//     pe_used: string;
//   };
//   signature: {
//     source: string;
//     version: string;
//   };
// }

// export interface OrbitElement {
//   units: string | null;
//   name: string;
//   sigma: string;
//   value: string;
//   title: string;
//   label: string;
// }

// async function obtenerAsteroide(spkid: string): Promise<SbdbResponse> {
//   const url = `https://ssd-api.jpl.nasa.gov/sbdb.api?sstr=${spkid}`;
//   const response = await fetch(url);
//   const data: SbdbResponse = await response.json();
//   return data;
// }

// obtenerAsteroide("3738932").then((asteroide) => {
//   console.log("Nombre completo:", asteroide.object.fullname);
//   console.log("Clase orbital:", asteroide.object.orbit_class.name);
//   console.log("Excentricidad:", asteroide.orbit.elements.find(e => e.name === "e")?.value);
// });