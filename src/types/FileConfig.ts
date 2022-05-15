import { ResizeOptions } from 'sharp';
import mimeTypes from '../config/mimeTypes.json';

export type SharpConfig = ResizeOptions;

/**
 * Type para las copias de las imágenes
 */
export type ImageCopiesType = {
  // Nombre/Identificador de la copia y sus opciones
  [key: string]: SharpConfig;
};

/**
 * Abreviaciones o grupos de tipos de archivos
 */
export type AllowedAbbreviations = {
  images: string[];
  documents: string[];
  video: string[];
  audio: string[];
};

/**
 * Extensiones permitidas
 */
export type AllowedExtensions = keyof typeof mimeTypes.types;

/**
 * Valores que puede recibir el campo allowed
 */
export type AllowedFiles = (keyof AllowedAbbreviations | AllowedExtensions)[];

export type FileConfig = {
  /**
   * Limite de archivos permitidos, si limit = false ó limit = 0 indica que no hay limite de
   * archivos para el campo
   * -- Atributo requerido
   */
  limit: number | boolean;
  /**
   * Tipos de archivos que se aceptan en el campo
   * -- Atributo requerido
   */
  allowed: AllowedFiles;
  /**
   * Configuración del thumbnail para los archivos de tipo imagen que se suban, si thumbnail = false
   * No se generará el thumbnail de las imágenes, si thumbnail = true, se tomarán las opciones por
   * default de este campo.
   * -- Atributo requerido
   */
  thumbnail: boolean | SharpConfig;
  /**
   * Configuración para las copias que se generarán de la imagen o imágenes qe se agreguen,
   * Si copies = false, no se realizarán copias,
   * -- Atributo requerido
   */
  copies: boolean | ImageCopiesType;
  /**
   * Titulo que sirve como sugerencia para mostrarlo en los componentes para subir archivos.
   */
  title?: string;
  /**
   * Descripción del campo sugerida para mostrarlo en los componentes para subir archivos.
   */
  description?: string;
  /**
   * Tamaño máximo en megabytes de los archivos
   */
  maxFileSize?: number;
  /**
   * Tamaño mínimo en megabytes de los archivos
   */
  minFileSize?: number;
  /**
   * Ancho mínimo permitido para las imágenes en pixeles
   */
  minWidth?: number;
  /**
   * Ancho máximo permitido para las imágenes en pixeles
   */
  maxWidth?: number;
  /**
   * Ancho mínimo permitido para las imágenes en pixeles
   */
  minHeight?: number;
  /**
   * Ando máximo permitido para las imágenes en pixeles
   */
  maxHeight?: number;
  /**
   * Configuración que indica de que tamaño se guardarán las imágenes que se suban
   */
  resizeOptions?: SharpConfig;
  /**
   * Mensajes de error
   */
  errors?: {
    // Cuando se excede el limite de archivos
    limit?: string;
    // Cuando el archivo subido no es de un tipo permitido
    allowed?: string;
    // Cuando excede el peso máximo de los archivos
    maxFileSize?: string;
    // Cuando no llega al peso mínimo permitido
    minFileSize?: string;
    // Cuando no llega al ancho mínimo permitido en las imágenes
    minWidth?: string;
    // Cuando excede el ancho máximo permitido en las imagenes
    maxWidth?: string;
    // Cuando no llega al alto mínimo permitido de las imágenes
    minHeight?: string;
    // Cuadno excede el alto máximo permitido de las imágenes
    maxHeight?: string;
  };
  /**
   * Nombre del modelo
   */
  model?: string;
  /**
   * Nombre del campo
   */
  field?: string;
  /**
   * TODO: Investigar para que es este campo
   */
  number?: string;
};
