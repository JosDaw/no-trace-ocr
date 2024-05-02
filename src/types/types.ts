export type LoggedInUser = {
  email: string;
  userID: string;
  userDoc: string;
  credit: number;
};

export interface Vertex {
  x: number;
  y: number;
}

export interface Annotation {
  description: string;
  boundingPoly: {
    vertices: Vertex[];
  };
}

export interface TextAnnotation {
  text: string;
}
