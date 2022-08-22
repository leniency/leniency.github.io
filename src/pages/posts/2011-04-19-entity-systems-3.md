---
title: GeoMap Demo
date: 2014-04-18
description: ""
categories: []
tags: ["GeoMap", "XNA"]
layout: "../../layouts/BlogPost.astro"
---

# Geomap Demo

[Geomap Image](assets/blog/2009-11-09-geomap-demo/kingdom.jpg) 

## Installation
Included with the program is the Microsoft XNA 3.1 redistributable. This MUST be installed in order for the demo to run.

- Unzip the contents of this file into the directory of your choosing
- Run xnafx31_redist.msi (XNA 3.1 Redistributable, included in download)
- Ensure that your DirectX is up to date via Windows Update. DirectX 9.0c redistributable may be required as well if you don't have it already (if you've installed a game in the last few years, you probably have it).
- Run Kingdom\Kingdom.exe to run the demo

## Requirements
 - A video card supporting Shader 2.0 (pretty much any video card in the past 5 years)
 - XNA 3.1 Redistributable
 - DirectX 9.0c Redistributable
 - XNA 3.1 Redistributable Information

## The Demo
This executbale loads a geodesic grid containing 642 cells. 12 of these are pentagons while the rest are hexagons. The grid is derived from a subdivided icosahedron. While I am able to generate grids of arbitrary size, that's not demonstrated here (grid is built as an XNA Content Pipeline project, not at run time)

## Controls
A simple first person camera is implemented. Use the keyboard arrow keys and right mouse button to move the camera. Shift + up/down will move the camera vertically.
Left clicking tiles on the map will increment their texture page.