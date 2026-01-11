---
title: "Image Processing Program in C"
date: 2026-01-11
excerpt: "A C-based image processing program demonstrating low-level manipulation of grayscale and color images through custom-built modules and transformation algorithms."
tags: [c, image-processing, programming, algorithms, computer-vision]
thumbnail: "/images/c.png"
---

#  Image Processing Program in C 
## 1. Project Overview
This project implements an **image processing program in C**, capable of handling both **grayscale (PGM)** and **color (PPM)** images.  
It was developed as part of an academic assignment in *Imperative Programming (2024-2025)*, with the goal of understanding low-level image manipulation and transformation techniques using the C language.

The program reads, processes, and writes images using custom-built modules and supports various transformations such as color conversion, brightness adjustment, inversion, level quantization, and image resampling (nearest neighbor and bilinear interpolation).

---

## 2. Objectives
- Implement basic image reading and writing for **PPM** and **PGM** formats.  
- Understand and manipulate **image structures**, **pixel data**, and **color channels**.  
- Apply a variety of transformations — e.g. brightness, inversion, quantization, blending, etc.
- Apply **Look-Up Tables (LUTs)** for pixel transformations.  
- Implement **arithmetic operations** and **resampling techniques** on images.  
- Provide a modular and maintainable codebase written entirely in C.

---

## 3. About PPM and PGM Formats
Both **PPM (Portable Pixmap)** and **PGM (Portable Graymap)** are simple image formats developed by Jef Poskanzer in 1988.  
They are defined by a *magic number* — `P6` for binary PPM and `P5` for binary PGM — followed by image dimensions and pixel values ranging from 0 to 255.

- **PGM (P5)** → Grayscale images with one channel (intensity).  
- **PPM (P6)** → Color images with three channels: **Red**, **Green**, and **Blue**.

| Color images(PPM)| Gray images(PGM)| Black images(PGM)|
|------|------|-------|
| ![](/images/image_cproject/lenna_color.png) | ![](/images/image_cproject/lenna_gray.png) | ![](/images/image_cproject/lenna_black.png) |

---

## 4. Implemented Features
The following operations are implemented and demonstrated in this project:

1. **Read and Write Image**
2. **Convert Gray ↔ Color**
3. **Split RGB Channels**
4. **Brighten Image**
5. **Melt (pixel blending)**
6. **Inverse (negative image)**
7. **Normalize Dynamic Range**
8. **Apply Look-Up Table (LUT) Transformation**
9. **Set Levels (quantization)**
10. **Resample (nearest & bilinear)** — resize image smaller or larger
11. **Arithmetic Operations** — difference, product, mixture of images

---

## 5. C Implementation
This section describes the internal organization of the project and how the image processing features are implemented in C using a modular design.

### 📂 Project Structure

| File | Description |
|------|--------------|
| **pictures.h / pictures.c** | Defines and implements core image operations such as reading, writing, creating, copying, converting, and cleaning images. |
| **pixels.h / pixels.c** | Manages pixel-level operations and defines symbolic color constants (RED, GREEN, BLUE) for RGB components. |
| **lut.h / lut.c** | Defines the Look-Up Table (LUT) structure and functions to create, clean, and apply LUTs for pixel transformations. |
| **filename.h / filename.c** | Provides functions to manipulate file paths and automatically generate output filenames based on operations. |
| **main.c** | The main entry point that demonstrates all implemented functionalities (conversion, brightness, inversion, resampling, etc.). Each operation is isolated and can be activated by uncommenting its corresponding code block. |
| **Makefile** | Automates compilation and linking of all source files into a single executable. |

---

### Image Module (`pictures.h` / `pictures.c`)
This module defines the core `Image` data structure and implements fundamental image operations, including reading and writing images, grayscale and color conversion, normalization, inversion, resampling, and memory management.

`pictures.h`
```c 
#ifndef PICTURES_H
#define PICTURES_H

//For unit8_t
#include <stdint.h> 

typedef unsigned char byte;
#define MAX_BYTE 255 

// Picture structure
typedef struct pictures picture;
struct pictures{
    unsigned int height;
    unsigned int width;
    unsigned int channels; //1 for grayscale and 3 for color
    byte *data;  //Pointer to picture data
};

/*
@requires: nothing
@assigns : nothing
@ensures : Read a PGM OR PPM file and returns a picture 
*/
picture read_picture(char *filename);

/*
@requires: nothing
@assigns : nothing
@ensures : Write a picture into a PGM or PPM file
*/
int write_picture(picture p, char *filename);

/*
@requires: width>0, height>0, channels > 0
@assigns : Dynamic allocation for data of picture or image(p.data)
@ensures : Return a initialise picture with the demension and channels specifics
*/
picture create_picture(unsigned int height,  unsigned int width, unsigned int channels);

/*
@requires: p != NULL
@assigns : Free memory associated with p->data, modify p fields (width, height, channels, data)
@ensures : Image data is freed, and width, height, channels fields are reset to 0, data is NULL
*/
void clean_picture(picture *p);

/*
@requires: p is a valid (non-empty) image.
@assigns : Allocates memory for the copied image data.
@ensures : Returns a copy of the image with the same dimensions, channels and data
           If the source image is empty, returns an empty image.
*/
picture copy_picture(picture p);

/*
@requires: nothing
@assigns : nothing
@ensures : Returns a non-zero value if the image is empty (NULL data or 0 dimensions/channels), 0 otherwise.
*/
int is_empty_picture(picture p);

/*
@requires: nothing
@assigns : nothing
@ensures : Returns a non-zero value if the image has a single channel(grayscale), 0 otherwise.
*/
int is_gray_picture(picture p);

/*
@requires: nothing
@assigns : nothing
@ensures : Returns a non-zero value if the image has a 3 channel(color), 0 otherwise.
*/
int is_color_picture(picture p);

/*
@requires: nothing
@assigns : nothing
@ensures : Display the info of picture(width, heigth, channels)
*/
void info_picture(picture p);

/*
@requires: p is valid picture
@assigns : Memory allocation for data of convert picture
@ensures : If the image is already in color, returns a copy. Otherwise, returns a color image by repeating the grayscale in each channel.
           Returns an empty image if allocation fails.
*/
picture convert_to_color_picture(picture p);

/*
@requires: p is valid picture
@assigns : Memory allocation for data of convert picture
@ensures : If the image is already grayscale, returns a copy. Otherwise, returns a converted grayscale image.
         Returns an empty image if allocation fails.
*/
picture convert_to_gray_picture(picture p);

/*
@requires: p is valid picture color
@assigns : Allocates memory for an array of 3 grayscale images (if the image is color) or one image (if it is grayscale).
@ensures : If the image is color, returns an array of 3 grayscale images corresponding to the R, G and B channels.
         If the image is grayscale, returns an array containing a copy of the image.
         Returns NULL on failure.
*/
picture *split_picture(picture p);

/*
@requires: The three images red, green and blue must have the same dimensions and be in grayscale.
@assigns : Allocates memory for the resulting color image data.
@ensures : Returns a color image composed of the three input images. Returns an empty image on failure.
*/
picture merge_picture(picture red, picture green, picture blue);

/*
@requires: p.data != NULL, factor > 0
@assigns : Allocates memory for the resulting image
@ensures : Returns a new image with brightness increased by the factor
*/
picture brighten_picture(picture p, double factor);

/*
@requires: p.data != NULL, number > 0
@assigns : Modifies pixel values in the image
@ensures : Returns a new image with melted pixel values based on the number of iterations
*/
picture melt_picture(picture p, int number);

/*
@requires: p is valid
@assigns : allocates a new LUT and modifies the image
@ensures : return the inverted image
*/
picture inverse_picture(picture p);

/*
@requires: p is valid
@assigns : modifies the image
@ensures : the pixel of p are spread between 0 and 255
*/
picture normalize_dynamic_picture(picture p);

/*
@requires: valid picture p and nb_levels > 1
@assigns : allocates and applies a new LUT to modify the image
@ensures : the pixel values are grouped into nb_levels distinct ranges
*/
picture set_levels_picture(picture p, byte nb_levels);

/*
@requires: p1 and p2 must have the same dimensions (width, height, channels)
@assigns : allocates memory for a new picture containing the difference
@ensures : returns an image with the absolute pixel-wise difference of p1 and p2
*/
picture diff_picture(picture p1, picture p2);

/*
@requires: p1 and p2 must have the same dimensions (width, height, channels)
@assigns : allocates memory for a new picture containing the difference
@ensures : returns an image with the product pixel-wise difference of p1 and p2
*/
picture mult_picture(picture p1, picture p2);

/*
@requires: p1 and p2 and p3 must have the same dimensions (width, height, channels)
@assigns : allocates memory for a new picture(mixed)
@ensures : return a new picture by using algorithm of mixture method
*/
picture mix_picture(picture p1, picture p2, picture p3);

/*
@requires: give a factor value 
@assigns : allocates memory for a result picture
@ensures : Resizes the input picture using nearest neighbor interpolation and returns the resized picture.
*/
picture resample_picture_nearest(picture image, unsigned int new_width, unsigned int new_height);

/*
@requires: give a factor value 
@assigns : allocates memory for a result picture
@ensures : Resizes the input picture using bilinear interpolation and returns the resized picture.
*/
picture resample_picture_bilinear(picture image, unsigned int new_width, unsigned int new_height);

/*
@requires: nothing
@assigns : allocates memory for a result picture
@ensures : return the resize image by using nearest neighbor intepolation between mask image and input image
*/
picture resize_mask(picture mask, unsigned int width, unsigned int height);

/*
@requires: img and mask must have the same dimensions
@assigns : nothing
@ensures : return the result image of product between img and mask after using resize_mask fonction
*/
picture image_mask_product(picture img,picture mask);

/*
@requires: input and original image must have the same dimensions
@assigns : nothing
@ensures : return the result image of mixture between inverted and mask after using resize_mask fonction
*/
picture image_mask_mixture(picture invert, picture original, picture resized_mask);

#endif //PICTURES_H
```

`pictures.c`
```c 
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <math.h>
#include "pictures.h"
#include "pixels.h"
#include "lut.h"


/*
@requires : nothing
@assigns  : nothing
@ensures  : Error handling
*/
static void error(const char *message) {
    fprintf(stderr, "%s\n", message);
    exit(EXIT_FAILURE);
}


// Read picture from PGM or PPM file
picture read_picture(char *filename){
    FILE *f = fopen(filename, "rb");
    if(!f) error("Error opening file");

    char buffer[128];
    unsigned int width;
    unsigned int height;
    byte *btm = NULL;

    //Read magic number
    fgets(buffer, 128, f);
    //PGM file(P5)
    if(strcmp(buffer,"P5\n") == 0){
        picture p = {0, 0, 1, NULL};
        fgets(buffer, 128, f);
        sscanf(buffer,"%d %d", &width,&height);
        fgets(buffer,128,f);

        //Allocate memory for grayscale pixels
        btm = malloc(height * width * sizeof(byte));
        if(!btm) error("Memory allocation failed");
        fread(btm, sizeof(byte), height*width, f);
        p.width = width;
        p.height = height;
        p.data = btm;
        fclose(f);
        return p;
    }
    //PPM file (P6)
    else if(strcmp(buffer, "P6\n") == 0){
        picture p = {0, 0, 3, NULL};
        fgets(buffer,128,f);
        sscanf(buffer,"%d %d", &height, &width);
        fgets(buffer,128,f);
        btm = malloc(width * height * 3 * sizeof(byte));
        if (!btm) error("Memory allocation failed");
        fread(btm, sizeof(byte), height*width*3, f);
        p.width = width;
        p.height = height;
        p.data = btm;

        fclose(f);
        return p;
    }
    else{
        fclose(f);
        error("Unsupported file format");
    }
    return (picture) {0};

}


// Write picture to new file
int write_picture(picture p,char *filename) {
    FILE *f = fopen(filename, "wb");
    if (!f) {
        fprintf(stderr, "Error opening file for writing: %s\n", filename);
        return 1;  
    }

    // Write header
    // PGM file (Grayscale image)
    if(p.channels == 1) {
        fprintf(f, "P5\n%d %d\n255\n", p.width, p.height);
        fwrite(p.data, sizeof(byte), p.width * p.height, f);
    } 
    // PPM file (Color image)
    else if(p.channels == 3) {       
        fprintf(f, "P6\n%d %d\n255\n", p.width, p.height);
        fwrite(p.data, sizeof(byte), p.width * p.height * 3, f);
    } 
    else{
        fclose(f);
        fprintf(stderr, "Unsupported image format\n");
        return 1;  
    }

    fclose(f);
    return 0;  // Return success code
}


//Create picture 
picture create_picture(unsigned int height,  unsigned int width, unsigned int channels){
    picture p;
    p.width = width;
    p.height = height;
    p.channels = channels;
    p.data = malloc(height * width *channels * sizeof(byte));
    if(!p.data){
        fprintf(stderr, "Error memory allocation.\n");
        picture empty = {0, 0, 0, NULL};
        return empty;
    }

    return p;
}


//Clean picture
void clean_picture(picture *p){
    if (p && p->data) {
        free(p->data);
        p->data = NULL;
        p->width = 0;
        p->height = 0;
        p->channels = 0;
    }
}


//Copy picture
picture copy_picture(picture p){
    if (is_empty_picture(p)){
        picture empty = {0, 0, 0, NULL};
        return empty;
    } 

    picture copy = create_picture(p.height, p.width, p.channels);
    if (copy.data) {
        for (size_t i = 0; i < p.width * p.height * p.channels; i++) {
            copy.data[i] = p.data[i];
        }   
    
    }
    return copy;
}


//Empty picture
int is_empty_picture(picture p) {
    return p.data == NULL || p.width == 0 || p.height == 0 || p.channels == 0;
}


//Is_grayscale picture
int is_gray_picture(picture p){
    return (p.channels == 1);
}


//Is_color picture
int is_color_picture(picture p){
    return (p.channels == 3);
}


//Display info of picture
void info_picture(picture p) {
    printf("(%d x %d x %d)\n", p.width, p.height, p.channels);
}


//Convert from gray picture to color picture
picture convert_to_color_picture(picture p){
    if (is_empty_picture(p)) {
        fprintf(stderr, "Error: Cannot convert an empty image to color.\n");
        picture empty = {0, 0, 0, NULL};
        return empty;
    }
    
    if(is_color_picture(p)){
        return copy_picture(p);
    }

    picture color = create_picture(p.height, p.width, 3);
    if(color.data){
        for(unsigned int i=0; i< p.height*p.width; i++){
            color.data[i * 3] = p.data[i];     //R
            color.data[i * 3 + 1] = p.data[i]; //G
            color.data[i * 3 + 2] = p.data[i]; //B
        }
    }
    return color;
}


//Convert from color to grayscale
picture convert_to_gray_picture(picture p){
    if (is_empty_picture(p)) {
        fprintf(stderr, "Error: Cannot convert an empty image to grayscale.\n");
        picture empty = {0, 0, 0, NULL};
        return empty;
    }
       
    if(is_gray_picture(p)){
        return copy_picture(p);
    }

    picture gray = create_picture(p.height, p.width, 1);
    if(gray.data){
        for(unsigned int i=0; i<p.height*p.width; i++){
            byte R = p.data[i * 3];
            byte G = p.data[i * 3 + 1];
            byte B = p.data[i * 3 + 2];
            gray.data[i] = (byte)(0.299 * R + 0.587 * G + 0.114 * B);
        }
    }
    return gray;
}


//Split a color image into its RGB components
picture *split_picture(picture p){
    if(is_gray_picture(p)){
        picture *single_channel = malloc(sizeof(picture));
        *single_channel = copy_picture(p);
        return single_channel;
    }
    if(!is_color_picture(p)) return NULL;

    picture *channels = malloc(3 * sizeof(picture));
    if(!channels) return NULL;

    for(int i=0; i< 3; i++){
        channels[i] = create_picture(p.height,p.width,1);
        if(channels[i].data){
            for(unsigned j=0; j<p.height*p.width; j++){
                channels[i].data[j] = p.data[j * 3 + i];
            }
        }      
    }

    return channels;

}


//Merge picture
picture merge_picture(picture red, picture green, picture blue){
    if(red.height != green.height || red.height != blue.height ||
        red.width != green.width || red.width != blue.width ||
        !is_gray_picture(red) || !is_gray_picture(green) || !is_gray_picture(blue)) {
        picture p = {0,0,0,NULL};
        return p;
    }

    picture color = create_picture(red.height, red.width, 3);
    if(color.data){
        for(unsigned int i=0; i < red.height * red.width; i++){
            color.data[i * 3] = red.data[i];
            color.data[i * 3 + 1] = green.data[i];
            color.data[i * 3 + 2] = blue.data[i];
        }
    }
    return color;

}  
 
 
//Brighten picture with factor 1.5
picture brighten_picture(picture p, double factor){
    if (!p.data || factor <= 0) {
        fprintf(stderr, "Invalid input for brightening\n");
        picture empty = {0, 0, 0, NULL};
        return empty;
    }

    picture brightened = create_picture(p.height, p.width, p.channels);
    if (!brightened.data) {
        fprintf(stderr, "Failed to allocate memory for brightened image\n");
        picture empty = {0, 0, 0, NULL};
        return empty;
    }

    for (unsigned int i = 0; i < p.width * p.height * p.channels; i++) {
        int value = (int)(p.data[i] * factor);
        if (value > MAX_BYTE) {
            brightened.data[i] = MAX_BYTE;
        } else {
            brightened.data[i] = (byte)value;
        }
    }
    return brightened;

}


// Melted image pixels based on the number of iterations
picture melt_picture(picture p, int number){
    if (!p.data || number <= 0) {
        fprintf(stderr, "Invalid input for melting\n");
        picture empty = {0, 0, 0, NULL};
        return empty;
    }
    picture melted = copy_picture(p);
    if (!melted.data) {
        fprintf(stderr, "Failed to allocate memory for melted image\n");
        picture empty = {0, 0, 0, NULL};
        return empty;
    }

    srand((unsigned int)time(NULL));
    for (int n = 0; n < number; ++n) {
        unsigned int i = rand() % p.width; 
        unsigned int j = rand() % (p.height - 1) + 1; 

        for (unsigned int c = 0; c < p.channels; ++c) {
            byte *current_pixel = &melted.data[(j * p.width + i) * p.channels + c];
            byte *above_pixel = &melted.data[((j - 1) * p.width + i) * p.channels + c];

            // Apply the melting logic
            if (*above_pixel < *current_pixel) {
                *current_pixel = *above_pixel;
            }
        }
    }

    return melted;
}


//Invert an image using a LUT
picture inverse_picture(picture p) {
    lut l = create_lut(256);
    for (int i = 0; i < 256; i++) {
        l.values[i] = 255 - i;
    }
    picture inverted = apply_lut(p, l);
    clean_lut(&l);
    return inverted;
}


//// Normalize the dynamic range of an image
picture normalize_dynamic_picture(picture p) {
    byte min_val = 255;
    byte max_val = 0;

    // Find min and max values
    for (unsigned int i = 0; i < p.height * p.width * p.channels; i++) {
        if (p.data[i] < min_val) min_val = p.data[i];
        if (p.data[i] > max_val) max_val = p.data[i];
    }

    if (min_val == max_val) {
        fprintf(stderr, "Cannot normalize an image with uniform pixel values\n");
        return copy_picture(p);
    }

    lut l = create_lut(256);
    for (int i = 0; i < 256; i++) {
        l.values[i] = (byte)(((i - min_val) * 255) / (max_val - min_val));
    }
    picture normalized = apply_lut(p, l);
    clean_lut(&l);
    return normalized;
}


//Set levels in an image
picture set_levels_picture(picture p, byte nb_levels){
    if (nb_levels < 2) {
        fprintf(stderr, "Number of levels must be at least 2\n");
        picture empty = {0, 0, 0, NULL};
        return empty;
    }

    lut l = create_lut(nb_levels);
    double step = 256.0 / nb_levels;
    for (unsigned int i = 0; i < nb_levels; i++) {
        // Map each level to its corresponding value in the range [0, 255]
        l.values[i] = (unsigned char)(i * step);
    }

    picture result = create_picture(p.height, p.width, p.channels);

     // Process each pixel
    for (unsigned int y = 0; y < p.height; y++) {
        for (unsigned int x = 0; x < p.width; x++) {
            // Process each color channel
            byte red_value = read_pixel_channel(&p, y, x, RED);
            byte green_value = read_pixel_channel(&p, y, x, GREEN);
            byte blue_value = read_pixel_channel(&p, y, x, BLUE);
            
            // Map each channel value to the appropriate level
            unsigned int red_level = (red_value * (nb_levels - 1)) / 255;
            unsigned int green_level = (green_value * (nb_levels - 1)) / 255;
            unsigned int blue_level = (blue_value * (nb_levels - 1)) / 255;
            
            // Write the new pixel values using the LUT
            write_pixel_channel(&result, y, x, RED, l.values[red_level]);
            write_pixel_channel(&result, y, x, GREEN, l.values[green_level]);
            write_pixel_channel(&result, y, x, BLUE, l.values[blue_level]);
        }
    }

    //picture leveled = apply_lut(p, l);
    clean_lut(&l);
    return result;
}


//Compute the difference between two images(absolute value)
picture diff_picture(picture p1, picture p2){
    if (p1.height != p2.height || p1.width != p2.width || p1.channels != p2.channels) {
        fprintf(stderr, "Error: Images must have the same dimensions.\n");
        picture empty = {0, 0, 0, NULL};
        return empty;
    }

    // Create a new image for the result
    picture result = create_picture(p1.height, p1.width, p1.channels);
    if (!result.data) {
        fprintf(stderr, "Failed to allocate memory for the difference image.\n");
        picture empty = {0, 0, 0, NULL};
        return empty;
    }

    // Compute the absolute difference
    for (unsigned int i = 0; i < p1.height * p1.width * p1.channels; i++) {
        result.data[i] = (byte)abs(p1.data[i] - p2.data[i]);
    }

    return result;
}


//Multiply two images
picture mult_picture(picture p1, picture p2){
    if (p1.height != p2.height || p1.width != p2.width || p1.channels != p2.channels) {
        fprintf(stderr, "Error: Images must have the same dimensions.\n");
        picture empty = {0, 0, 0, NULL};
        return empty;
    }

    // Create a new image for the result
    picture result = create_picture(p1.height, p1.width, p1.channels);
    if (!result.data) {
        fprintf(stderr, "Failed to allocate memory for the product image.\n");
        picture empty = {0, 0, 0, NULL};
        return empty;
    }
    for (unsigned int i = 0; i < p1.height * p1.width * p1.channels; i++) {
        unsigned int product = p1.data[i] * p2.data[i];
        if (product > MAX_BYTE) {
            result.data[i] = MAX_BYTE;
        } 
        else {
            result.data[i] = (byte)product;
        }
    }
    return result;
}


// Mixture images
picture mix_picture(picture p1, picture p2, picture p3) {
    if (p1.width != p2.width || p1.height != p2.height || p1.channels != p2.channels ||
        p1.width != p3.width || p1.height != p3.height || p1.channels != p3.channels) {
        fprintf(stderr, "Error: Images must have the same dimensions and channels for mixing operation.\n");
        picture empty = {0, 0, 0, NULL};
        return empty;
    }

    picture mixed = create_picture(p1.width, p1.height, p1.channels);

    for (unsigned int i = 0; i < p1.width * p1.height * p1.channels; ++i) {
        float alpha = p3.data[i] / 255.0f; // Normalize p3 values to [0, 1]
        mixed.data[i] = (byte)((1.0f - alpha) * p1.data[i] + alpha * p2.data[i]);
    }

    return mixed;
}


// Resample image using nearest neighbor interpolation
picture resample_picture_nearest(picture image, unsigned int new_width, unsigned int new_height) {
    // Allocate memory for the new image
    picture result;
    result.width = new_width;
    result.height = new_height;
    result.channels = image.channels;
    result.data = (byte*)malloc(new_width * new_height * image.channels);

    if (result.data == NULL) {
        fprintf(stderr, "Error: Unable to allocate memory for resized image.\n");
        exit(1);
    }

    // Calculate scale factors
    float x_scale_factor = (float)image.width / new_width; // Scale factor for width
    float y_scale_factor = (float)image.height / new_height; // Scale factor for height

    // Perform nearest neighbor interpolation
    for (unsigned int y = 0; y < new_height; y++) {
        for (unsigned int x = 0; x < new_width; x++) {
            // 1. Compute the nearest source pixel coordinates
            unsigned int src_x = (unsigned int)(x * x_scale_factor);
            unsigned int src_y = (unsigned int)(y * y_scale_factor);

            // Ensure source coordinates do not exceed bounds
            if (src_x >= image.width) src_x = image.width - 1;
            if (src_y >= image.height) src_y = image.height - 1;

            // 2. Copy pixel data from the source image to the destination image
            for (unsigned int c = 0; c < image.channels; c++) {
                result.data[(y * new_width + x) * image.channels + c] = 
                    image.data[(src_y * image.width + src_x) * image.channels + c];
            }
        }
    }

    return result;
}


// Resample image using bilinear interpolation
picture resample_picture_bilinear(picture image, unsigned int new_width, unsigned int new_height) {
    // Allocate memory for the new image
    picture result;
    result.width = new_width;
    result.height = new_height;
    result.channels = image.channels;
    result.data = (byte*)malloc(new_width * new_height * image.channels);

    if (result.data == NULL) {
        fprintf(stderr, "Error: Unable to allocate memory for resized image.\n");
        exit(1);
    }

    // Calculate scale factors
    float x_scale_factor = (float)image.width / new_width;
    float y_scale_factor = (float)image.height / new_height;

    // Perform bilinear interpolation
    for (unsigned int y = 0; y < new_height; y++) {
        for (unsigned int x = 0; x < new_width; x++) {
            // Calculate source coordinates
            float src_x = x * x_scale_factor;
            float src_y = y * y_scale_factor;

            // Find surrounding pixels
            unsigned int x1 = (unsigned int)src_x;
            unsigned int y1 = (unsigned int)src_y;
            unsigned int x2 = x1 + 1;
            if (x2 >= image.width) x2 = x1;
            unsigned int y2 = y1 + 1;
            if (y2 >= image.height) y2 = y1;

            // Calculate interpolation coefficients
            float alpha = src_x - x1;
            float beta = src_y - y1;

            // Interpolate pixel value for each channel
            for (unsigned int c = 0; c < image.channels; c++) {
                float p1 = image.data[(y1 * image.width + x1) * image.channels + c];
                float p2 = image.data[(y1 * image.width + x2) * image.channels + c];
                float p3 = image.data[(y2 * image.width + x1) * image.channels + c];
                float p4 = image.data[(y2 * image.width + x2) * image.channels + c];

                result.data[(y * new_width + x) * image.channels + c] = (byte)(
                    ((1.0f - alpha) * (1.0f - beta) * p1) +
                    (alpha * (1.0f - beta) * p2) +
                    ((1.0f - alpha) * beta * p3) +
                    (alpha * beta * p4)
                );
            }
        }
    }

    return result;
}


// Resize the mask to match the size of the input image
picture resize_mask(picture mask, unsigned int width, unsigned int height) {
    return resample_picture_nearest(mask, width, height); // Use nearest neighbor for mask resizing
}


//Calculer the pixel product of an image and a mask
picture image_mask_product(picture img, picture mask){
    if (img.width != mask.width || img.height != mask.height || img.channels != mask.channels) {
        fprintf(stderr, "Error: Image and mask have difference dimensions.\n");
        picture empty = {0, 0, 0, NULL};
        return empty;
    }
    picture product = create_picture(img.height, img.width, img.channels);
    for(unsigned int i=0; i < img.width * img.height * img.channels; i++){
        unsigned int scale_value = (img.data[i] * mask.data[i]) / 255;
        product.data[i] = (byte)scale_value; 
    }

    return product;
}


//Mix original and inverted images using mask
picture image_mask_mixture(picture invert, picture original, picture resized_mask){
    if(resized_mask.height != original.height || resized_mask.width != original.width || resized_mask.channels != original.channels){
        fprintf(stderr, "Error: Original and mask image have the difference dimensions.\n");
        picture empty = {0, 0, 0, NULL};
        return empty;
    }

    picture mixture = create_picture(original.height, original.width, original.channels);
    for(unsigned int i = 0; i < original.width * original.height * original.channels; i++){
        float alpha = resized_mask.data[i] / 255.0f; // Normalize mask value to [0, 1]
        mixture.data[i] = (byte)((1 - alpha) * invert.data[i] + alpha * original.data[i]);
    }

    return mixture;
}
```

###  Pixel Module (`pixels.h` / `pixels.c`)
This module handles low-level pixel operations and provides symbolic constants (`RED`, `GREEN`, `BLUE`) for accessing and manipulating RGB image channels.

`pixels.h`

```c 
#ifndef PIXELS_H
#define PIXELS_H

#include "pictures.h"

// Define symbolic constants for color channels
typedef enum {
    RED = 0,
    GREEN = 1,
    BLUE = 2
} ColorChannel;

/*
@requires: p is valid picture
@assigns : nothing
@ensures : return the value of a specific component(channel) of a pixel
*/
byte read_pixel_channel(picture *p, unsigned int row, unsigned int col, ColorChannel channel);

/*
@requires: p is valid picture
@assigns : nothing
@ensures : Write a value to a specific component(channel) of a pixel
*/
void write_pixel_channel(picture *p, unsigned int row, unsigned int col, ColorChannel channel, byte value);

#endif // PIXELS_H
```

`pixels.c`
```c
#include <stdio.h>
#include "pictures.h"
#include "pixels.h"


// Read the value of a specific component(channel) of a pixel
byte read_pixel_channel(picture *p, unsigned int row, unsigned int col, ColorChannel channel) {
    if (!p->data || row >= p->height || col >= p->width || channel >= p->channels) {
        fprintf(stderr, "Error: Invalid pixel access.\n");
        return 0;
    }
    return p->data[((row * p->width + col) * p->channels) + channel];
}


// Write a value to a specific component(channel) of a pixel
void write_pixel_channel(picture *p, unsigned int row, unsigned int col, ColorChannel channel, byte value) {
    if (!p->data || row >= p->height || col >= p->width || channel >= p->channels) {
        fprintf(stderr, "Error: Invalid pixel access.\n");
        return;
    }
    p->data[((row * p->width + col) * p->channels) + channel] = value;
}

```

### Look-Up Table Module (`lut.h` / `lut.c`)
This module implements Look-Up Table (LUT) functionality, enabling efficient pixel-wise transformations such as intensity mapping and dynamic range normalization.

`lut.h`

```c
#ifndef LUT_H
#define LUT_H
#include "pictures.h"

//LUT structure
typedef struct {
    int size; // Number of values in the LUT
    byte *values; // Array of LUT values
} lut;

/*
@requires size > 0
@assigns nothing
@ensures result != NULL
*/
lut create_lut(int size);

/*
@requires l != null
@assigns l->values, l
@ensures l = NULL
*/
void clean_lut(lut *l);

/*
@requires l.size == 256 and valid image p
@assigns modifies image pixels in p
@ensures the pixel values in p are updated based on the LUT
*/
picture apply_lut(picture p, lut l);

#endif //LUT_H
```

`lut.c`

```c
#include <stdlib.h>
#include <stdio.h>
#include <math.h>
#include "pictures.h"
#include "lut.h"

// Create a LUT
lut create_lut(int size) {
    lut l;
    l.size = size;
    l.values = malloc(size * sizeof(byte));

    if (!l.values) {
        fprintf(stderr, "Failed to allocate memory for LUT.\n");
        l.size = 0;
    }
    return l;
}


//Clean lut
void clean_lut(lut *l) {
    if (l->values) {
        free(l->values);
        l->values = NULL;
    }
    l->size = 0;
}


// Apply a LUT to an image
picture apply_lut(picture p, lut l) {
    if (!p.data || l.size <= 0 || !l.values) {
        fprintf(stderr, "Invalid input for apply_lut.\n");
        picture empty = {0, 0, 0, NULL};
        return empty;
    }

    picture modified = create_picture(p.height, p.width, p.channels);
    if(!modified.data) {
        fprintf(stderr, "Failed to allocate memory for modified image.\n");
        picture empty = {0, 0, 0, NULL};
        return empty;
    }

    for(unsigned int i = 0; i < p.height * p.width * p.channels; i++){
        // Map pixel value to the LUT range and apply LUT
        modified.data[i] = l.values[p.data[i]];
    }

    return modified;
}
```

### Filename Utility Module (`filename.h` / `filename.c`)
This module provides helper functions to manipulate file paths and automatically generate output filenames based on the applied image processing operations.

`filename.h`
```c
/*
 * filename.h
 * Contient des fonctions pour décomposer un nom de fichier
 * <dirname>/<name>.<ext> en:
 *  - dirname = chemin avant le nom du fichier
 *  - name = nom du fichier : <dirname>/<name>.<ext>
 *  - ext = l'extension du fichier
 */

#ifndef __FILENAME__
#define __FILENAME__

#ifdef _WIN32
    #define PATH_SEP '\\'
#else
    #define PATH_SEP '/'
#endif

/**
 * Extraction du chemin avant le nom depuis le path d'un fichier
 * @param [in] path le chemin complet du fichier
 * @return le répertoire du fichier
 */
char * dir_from_path(char * path);

/**
 * Extraction du nom depuis le path d'un fichier
 * @param [in] path le chemin complet du fichier
 * @return le nom du fichier sans l'extension
 */
char * name_from_path(char * path);

/**
 * Extraction de l'extension du fichier depuis le path d'un fichier
 * @param [in] path le chemin complet du fichier
 * @return l'extension du fichier ou bien NULL si path ne contient aucune
 * extension
 */
char * ext_from_path(char * path);

/**
 * Concaténation des diverses parties d'un chemin pour composer un nouveau
 * chemin: <dir><name>_<op>.<ext>
 * @param [in] dir la partie répertoire du chemin
 * @param [in] name la partie nom du chemin
 * @param [in] op la partie opération du chemin
 * @param [in] ext la partie extension du chemin
 * @return une nouvelle chaîne dynamiquement allouée contenant le chemin
 * composé des différentes parties
 */
char * concat_parts(char * dir, char * name, char * op, char * ext);

#endif  // __FILENAME__
```
`filename.c`
```c
#include "filename.h"
#include <libgen.h> // for pattern matching
#include <stdlib.h> // for alloc funcs
#include <string.h>	// for strlen

/*
 * Extraction du chemin avant le nom depuis le path d'un fichier
 * @param [in] path le chemin complet du fichier
 * @return le répertoire du fichier
 */
char * dir_from_path(char * path)
{
	return dirname(strdup(path));
}

/**
 * Extrait une sous chaîne d'une chaîne
 * @param [in] string la chaîne dont on veut extraire une sous chaîne
 * @param [in] start l'index du début de l'extraction (start inclus)
 * @param [in] end l'index au delà de la fin de l'extraction (end exclus)
 * @return une sous-chaîne dynamiquement allouée contenant end - start + 1
 * caractères (avec le `\0` à la fin)
 */
char * substr(char * string, size_t start, size_t end)
{
	size_t len = strlen(string);
	if (start >= end || start > len || end > len)
	{
		return NULL;
	}
	char * result = calloc(end - start + 1, sizeof(char));
	for (size_t i = start, j = 0; i < end; i++, j++)
	{
		result[j] = string[i];
	}

	return result;
}

/**
 * Index de la dernière occurrence du caractère c dans la chaîne s
 * @param [in] s la chaîne s à explorer
 * @param [in] c le caractère à rechercher
 * @return l'index de la dernière occurrence du caractère c dans la chaîne s
 * ou bien -1 si aucune occurrence n'a été trouvée
 */
int last_index_of(char * s, char c)
{
	int index = -1;
	size_t i = 0;

	while (s[i] != '\0')
	{
		if (s[i] == c)
		{
			index = (int) i;
		}
		i++;
	}

	return index;
}

/*
 * Extraction du nom depuis le path d'un fichier
 * @param [in] path le chemin complet du fichier
 * @return le nom du fichier sans l'extension
 */
char * name_from_path(char * path)
{
	char * file_name = basename(path);
	int dot_index = last_index_of(file_name, '.');
	if (dot_index == -1)
	{
		return file_name;
	}
	return substr(file_name, 0, dot_index);
}

/*
 * Extraction de l'extension du fichier depuis le path d'un fichier
 * @param [in] path le chemin complet du fichier
 * @return l'extension du fichier ou bien NULL si path ne contient aucune
 * extension
 */
char * ext_from_path(char * path)
{
	char * file_name = basename(path);
	const size_t full_length = strlen(file_name);
	int dot_index = last_index_of(file_name, '.');
	if (dot_index == -1)
	{
		return NULL;
	}
	return substr(file_name, dot_index + 1, full_length);
}

/*
 * Concaténation des diverses parties d'un chemin pour composer un nouveau
 * chemin: <dir><name>_<op>.<ext>
 * @param [in] dir la partie répertoire du chemin
 * @param [in] name la partie nom du chemin
 * @param [in] op la partie opération du chemin
 * @param [in] ext la partie extension du chemin
 * @return une nouvelle chaîne dynamiquement allouée contenant le chemin
 * composé des différentes parties
 */
char * concat_parts(char * dir, char * name, char * op, char * ext)
{
	size_t total_length = strlen(dir);
    total_length += strlen(name);
    total_length += strlen(op);
    total_length += strlen(ext);
    total_length += 4; // for '/' + '_' + '.' + trailing '\0'
	char * result = (char *) calloc(total_length, sizeof(char));
	const char z = '\0';
	size_t i = 0;
	while (*dir != z)
	{
		result[i++] = *dir;
		dir++;
	}
    result[i++] = PATH_SEP;
	while (*name != z)
	{
		result[i++] = *name;
		name++;
	}
	result[i++] = '_';
	while (*op != z)
	{
		result[i++] = *op;
		op++;
	}
	result[i++] = '.';
	while (*ext != z)
	{
		result[i++] = *ext;
		ext++;
	}
	return result;
}

```

###  Main Program (`main.c`)
This file serves as the entry point of the application. It demonstrates all implemented image processing features.

`main.c`
```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>
#include "pictures.h"
#include "filename.h"
#include "pixels.h"

int main(int argc, char *argv[]){

    //Iteration for input filename into argv[i] while execute by comment line
    for(int i=1; i<argc; i++){
        if(argc < 2){
        fprintf(stderr, "usage: %s <input_filename1> <input_filename2>\n", argv[0]);
        exit(1);
        }
    }

    //Implement filename to create the output_name of read file
    char* dir = dir_from_path(argv[1]);
    char* name = name_from_path(argv[1]);
    char* ext = ext_from_path(argv[1]);


    // **1. Read and Write fonction**
    picture p = read_picture(argv[1]);
    printf("File read successful!\n");
    write_picture(p, concat_parts(dir,name,"out",ext));
    printf("Write: %s\n", concat_parts(dir,name,"out",ext));
    clean_picture(&p);


    **2. Convert fonction from Gray to color**
    picture p = read_picture(argv[1]);
    picture convert_gray = convert_to_color_picture(p);
    write_picture(convert_gray ,concat_parts(dir,name,"convert_color",ext));
    printf("Write: %s\n", concat_parts(dir,name,"convert_color",ext));
    clean_picture(&convert_gray);


     // **3. Convert fonction from Color to gray**
    picture p = read_picture(argv[1]);
    picture convert_color = convert_to_gray_picture(p);
    write_picture(convert_color ,concat_parts(dir,name,"convert_gray",ext));
    printf("Write: %s\n", concat_parts(dir,name,"convert_gray",ext));
    clean_picture(&convert_color);


    // **4. Convert color image into 3 components (red, green, blue)**
    picture p = read_picture(argv[1]);
    picture *channels = split_picture(p);
    write_picture(channels[RED] ,concat_parts(dir,name,"red",ext));
    printf("Write: %s\n", concat_parts(dir,name,"red",ext));
    write_picture(channels[GREEN] ,concat_parts(dir,name,"green",ext));
    printf("Write: %s\n", concat_parts(dir,name,"green",ext));
    write_picture(channels[BLUE] ,concat_parts(dir,name,"blue",ext));
    printf("Write: %s\n", concat_parts(dir,name,"blue",ext));
    for(int i=0; i<3; i++){
    clean_picture(&channels[i]);
    }


    // **5. Brighten picture with factor 1.5**
    picture p = read_picture(argv[1]);
    picture brightened = brighten_picture(p, 1.5);
    write_picture(brightened ,concat_parts(dir,name,"brighten",ext));
    printf("Write: %s\n", concat_parts(dir,name,"brighten",ext));
    clean_picture(&brightened);
    

    // **6. Melt the image**
    picture p = read_picture(argv[1]);
    int number = p.width * p.height * p.channels * 5;
    picture melted = melt_picture(p, number);
    write_picture(melted, concat_parts(dir,name,"melted",ext));
    printf("Write: %s\n", concat_parts(dir,name,"melted",ext));
    clean_picture(&melted);
    

    // **7. Inverse the image**
    picture p = read_picture(argv[1]);
    picture inverted = inverse_picture(p);
    write_picture(inverted, concat_parts(dir,name,"inverse",ext));
    printf("Write: %s\n", concat_parts(dir,name,"inverse",ext));
    clean_picture(&inverted);


    // **8. Normalize dynamic grayscale**
    picture p = read_picture(argv[1]);
    picture normalized = normalize_dynamic_picture(p);
    write_picture(normalized, concat_parts(dir,name,"dynamic",ext));
    clean_picture(&normalized);


    // **9. Normalize dynamic to 3 components of color image**
    picture red = read_picture(argv[1]);
    picture green = read_picture(argv[2]);
    picture blue = read_picture(argv[3]);
    //apply normalize to all components 
    picture p1 = normalize_dynamic_picture(red);
    picture p2= normalize_dynamic_picture(green);
    picture p3= normalize_dynamic_picture(blue);
    apply merge after normalize it
    picture merge = merge_picture(p1, p2, p3);
    write_picture(merge, concat_parts(dir,name,"dynamic",ext));
    clean_picture(&merge);
    
    
    // **10. Set level**
    picture p = read_picture(argv[1]);
    picture leveled = set_levels_picture(p,8);
    write_picture(leveled, concat_parts(dir,name,"levels",ext));
    printf("Set level success: %s\n", concat_parts(dir,name,"levels",ext));
    clean_picture(&leveled);
    

    // **11. Resample the image into smaller**
    float factor = 1.36;
    picture p = read_picture(argv[1]);
    unsigned int small_width = (unsigned int)(p.width / factor);
    unsigned int small_height = (unsigned int)(p.height / factor);
    //Smaller nearest
    picture smaller_nearest = resample_picture_nearest(p,small_width,small_height);
    write_picture(smaller_nearest, concat_parts(dir,name,"smaller_nearest",ext));
    printf("Write: %s\n", concat_parts(dir,name,"smaller_nearest",ext));
    clean_picture(&smaller_nearest);
    //Smaller bilinear
    picture smaller_bilinear = resample_picture_bilinear(p, small_width, small_height);
    write_picture(smaller_bilinear, concat_parts(dir,name,"smaller_bilinear",ext));
    printf("Write: %s\n", concat_parts(dir,name,"smaller_bilinear",ext));
    clean_picture(&smaller_bilinear);


    // **12. Resample the image into larger**
    float large_factor = 1.36;
    picture p = read_picture(argv[1]);
    unsigned int large_width = (unsigned int)(p.width * large_factor);
    unsigned int large_height = (unsigned int)(p.height * large_factor);
    //Larger nearest
    picture enlarged_nearest = resample_picture_nearest(p, large_width, large_height);
    write_picture(enlarged_nearest, concat_parts(dir,name,"larger_nearest",ext));
    printf("Write: %s\n", concat_parts(dir,name,"larger_nearest",ext));
    clean_picture(&enlarged_nearest);

    // **13. Larger bilinear **
    picture enlarged_bilinear = resample_picture_bilinear(p, large_width, large_height); 
    write_picture(enlarged_bilinear, concat_parts(dir,name,"larger_bilinear",ext));
    printf("Write: %s\n", concat_parts(dir,name,"larger_bilinear",ext));
    clean_picture(&enlarged_bilinear);


    // **14. Difference between Lenna_[gray|color]_larger_nearest.p[g|p]m and Lenna_[gray|color]_larger_bilinear.p[g|p]m **
    picture p1 = read_picture(argv[1]);  // Input Lenna_[gray|color]_larger_nearest.p[g|p]m (which was created above)
    picture p2 = read_picture(argv[2]); // Input Lenna_[gray|color]_larger_bilinear.p[g|p]m (which was created above)
    picture diff = diff_picture(p1,p2);
    write_picture(diff, concat_parts(dir,name,"difference",ext));
    printf("Write: %s\n", concat_parts(dir,name,"difference",ext));
    clean_picture(&diff);


    // ** 15. Product of input image with mask**
    picture input = read_picture(argv[1]); //Input Lenna_gray.pgm
    picture mask = read_picture(argv[2]);  //Input Lenna_BW.pgm
    picture resized_mask = resize_mask(mask, input.width, input.height);
    picture product = image_mask_product(input, resized_mask);
    write_picture(product, concat_parts(dir,name,"product",ext));
    printf("Write: %s\n", concat_parts(dir,name,"product",ext));
    clean_picture(&product);

    //** 16. Mixture of the previously calculated inverted image and the input image using the mask
    picture input = read_picture(argv[1]);  //Input Lenna_color.ppm 
    picture inverted = inverse_picture(input);
    picture mask = read_picture(argv[2]);   // Input Lenna_color.ppm
    picture resized_mask = resize_mask(mask, input.width, input.height);
    picture mixture = image_mask_mixture(inverted, mask, resized_mask);
    write_picture(mixture, concat_parts(dir,name,"mixture",ext));
    clean_picture(&mixture);

}

```

### ⚙️ Build System (`Makefile`)
The Makefile automates the compilation and linking process of all modules, allowing the project to be built easily and consistently.

`Makefile`

```c
CC = gcc
CFLAGS = -g -Wall -Wextra
LFLAGS = -lm

#targets
all: prog

filename.o: filename.h
	$(CC) $(CFLAGS) -c filename.c

pictures.o: pictures.h
	$(CC) $(CFLAGS) -c pictures.c

pixels.o: pixels.h pictures.h
	$(CC) $(CFLAGS) -c pixels.c

lut.o: lut.h pictures.h
	$(CC) $(CFLAGS) -c lut.c

main.o: filename.h pictures.h pixels.h lut.h
	$(CC) $(CFLAGS) -c main.c

prog: filename.o pictures.o pixels.o lut.o main.o
	$(CC) $(CFLAGS) $^ -o $@ $(LFLAGS)

clean:
	rm -f *.o prog
```

## 6. Results 
Below are the images resulting from some implementation features from the projects: 


| Color inverse | Color melted | Color melted |
|------|------|-------|
| ![](/images/image_cproject/inverse.png) | ![](/images/image_cproject/melted.png) | ![](/images/image_cproject/mixture.png) |

| Gray inverse | Gray product | Color brighten |
|------|------|-------|
| ![](/images/image_cproject/gray_inverse.png) | ![](/images/image_cproject/gray_product.png) | ![](/images/image_cproject/brighten.png) |

## 🧾 References
- [Wikipedia – Portable Pixmap](https://en.wikipedia.org/wiki/Portable_pixmap)  
- [Wikipedia – Image Scaling](https://en.wikipedia.org/wiki/Image_scaling#Nearest-neighbor_interpolation)  
- [Chathura Gunasekera – Image Resampling Algorithms](https://medium.com/@chathuragunasekera/image-resampling-algorithms-for-pixel-manipulation-bee65dda1488)
