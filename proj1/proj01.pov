// #include "colors.inc"
// #include "textures.inc"

// background { color rgb <0.5, 0.5, 0.5> }

// camera {
//   location <225, 50, 225>
//   look_at 0
//   angle 36
// }
// light_source { <500, 500, -1000> White }

// //bottom of model
// box { 
//   <100,-1,0>
//   <0,0,100>
//   pigment { checker Green White }
// }

// //left mirror
// box { 
//   <100,0,2>
//   <0,70,0>
//   finish { reflection {0.3, 2} ambient 0 diffuse 0 }
// }

// //right mirror
// box { 
//   <2,0,100>
//   <0,70,0>
//   finish { reflection {0.3, 2} ambient 0 diffuse 0 }
// }

// //table
// // calvin marroon 59,15,17
// cone {
//     <50,-500,50> 80
//     <50,-1,50>, 80
//     texture {
//         pigment { color rgb <0.2313, 0.0588, 0.0666> }
//     }
// }

// //################### Saucer
// union {
//     // cockpit
//     difference {
//         sphere {
//             <25, 40, 25>, 6
//             texture {
//                 NBoldglass
//             }
//         }

//         box {
//             <18,33,18>
//             <32,40,32> 
//         }
//     }

//     // //upper saucer
//     // //rgb 217, 215,215
//     // cone {
//     //     <25,40,25> 6
//     //     <25,37,25>, 9
//     //     texture {
//     //         pigment { color rgb <0.8509, 0.8431, 0.8431> }
//     //     }
//     // }

//     //upper saucer
//     //rgb 217, 215,215
//     cone {
//         <25,40,25> 6
//         <25,37,25>, 9
//         texture {
//             pigment { color rgb <0.8509, 0.8431, 0.8431> }
//             finish   { ambient 0.8 diffuse 0.8 phong 1 }
//         }
//     }

//     //lower saucer
//     //rgb 217, 215,215
//     cone {
//         <25,34,25> 6
//         <25,37,25>, 9
//         texture {
//             pigment { color rgb <0.8509, 0.8431, 0.8431> }
//             finish   { ambient 0.8 diffuse 0.8 phong 1 }
//         }
//     }
// }



#include "colors.inc"
#include "textures.inc"

background { color rgb <0.5, 0.5, 0.5> }

camera {
  location <113, 25, 113>
  look_at 0
  angle 36
}
light_source { <500, 500, -1000> White }

//bottom of model
box { 
  <50,-1,0>
  <0,0,50>
  pigment { checker Green White }
}

//left mirror
box { 
  <50,0,1>
  <0,35,0>
  finish { reflection {0.3, 2} ambient 0 diffuse 0 }
}

//right mirror
box { 
  <1,0,50>
  <0,35,0>
  finish { reflection {0.3, 2} ambient 0 diffuse 0 }
}

//table
// calvin marroon 59,15,17
cone {
    <25,-250,25> 40
    <25,-1,25>, 40
    texture {
        pigment { color rgb <0.2313, 0.0588, 0.0666> }
    }
}

//################### ufo
union {
    // cockpit
    difference {
        sphere {
            <25, 25, 25>, 3
            texture {
                NBoldglass
            }
        }

        box {
            <20,21,20>
            <29,25,29> 
        }
    }

    //upper saucer
    //rgb 217, 215,215
    cone {
        <25,25,25>, 3
        <25,24,25>, 6
        texture {
            Chrome_Metal
        }
    }

    //upper saucer
    //rgb 217, 215,215
    cone {
        <25,24,25>, 6
        <25,23,25>, 3
        texture {
            Chrome_Metal
        }
    }

    // //beam
    // cone {
    //     <25,23,25>, 3
    //     <25,0,25>, 6
    //     texture {
    //         NBoldglass
    //     }
    // }

    // //lower saucer
    // //rgb 217, 215,215
    // cone {
    //     <25,24,25> 6
    //     <25,23,25>, 3
    //     texture {
    //         pigment { color rgb <0.8509, 0.8431, 0.8431> }
    //         finish   { ambient 0.8 diffuse 0.8 phong 1 }
    //     }
    // }
}

// ufo beam
light_source {
  <25, 23, 25>
  color White
  spotlight
  radius 8
  falloff 5
  tightness 20
  point_at <25, 0, 25>
}

// person
blob {
    threshold 0.2
    //head
    sphere {
        <25, 14, 25>, 0.5,1
        texture {
            pigment {color rgb <1, 0.8588, 0.6745>}
            finish{
                ambient .2
                diffuse .6
                phong .75
                phong_size 25
            }
        }
    }

    //body
    cylinder {
        <25,13.5,24.25>,
        <25,13,23>, 0.5, 1
        texture {
            pigment {color rgb <0.2313, 0.0588, 0.0666>}
            finish{
                ambient .2
                diffuse .6
                phong .75
                phong_size 25
            }
        }
    }

    //arms
    cylinder {
        <25,13.5,24>,
        <25,15,25>, 0.1, 1
        texture {
            pigment {color rgb <0.2313, 0.0588, 0.0666>}
            finish{
                ambient .2
                diffuse .6
                phong .75
                phong_size 25
            }
        }
    }
    cylinder {
        <25,13.5,24>,
        <25,12,25>, 0.1, 1
        texture {
            pigment {color rgb <0.2313, 0.0588, 0.0666>}
            finish{
                ambient .2
                diffuse .6
                phong .75
                phong_size 25
            }
        }
    }

    //legs
    cylinder {
        <25,12,21>,
        <25,13,23>, 0.3, 1
        texture {
            pigment {color rgb <0.2313, 0.0588, 0.0666>}
            finish{
                ambient .2
                diffuse .6
                phong .75
                phong_size 25
            }
        }
    }

    cylinder {
        <25,14,21>,
        <25,13,23>, 0.3, 1
        texture {
            pigment {color rgb <0.2313, 0.0588, 0.0666>}
            finish{
                ambient .2
                diffuse .6
                phong .75
                phong_size 25
            }
        }
    }
    
}