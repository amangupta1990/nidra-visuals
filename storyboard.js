var bloomParams = {
	exposure: 0.1,
	bloomStrength: 0.25,
	bloomThreshold: 0.25,
	bloomRadius: 1
};


function animateBloom(ex,bt,bs,br,duration){
   
    anime({
        
        targets: bloomParams,
        exposure: ex,
        bloomStrength: bs,
        bloomThreshold: bt,
        bloomRadius: br,
        duration: duration,
        easing:"linear",
        update: function (){
            bloomPass.strength = bloomParams.bloomStrength;
            renderer.toneMappingExposure = bloomParams.exposure
            bloomPass.bloomThreshold = bloomParams.bloomThreshold;
            bloomPass.radius = bloomParams.bloomRadius;
        },
    })
}


function animateFlowers(){
    for (let flower of flowers)
    {

    
        flower.rgb1 = {
            r: 0,
            g: 0,
            b: 0,
            scale: 1
        };


    anime({

        targets: flower.rgb1,
        duration: metronome.quaterNoteLength,
        easing: 'linear',
        direction:'alternate',
        r: 100*Math.random(),
        g: 100*Math.random(),
        b: 100*Math.random(),
        scale: 1.2,
        update: function () {
            flower.material.color.setRGB(flower.rgb1.r, flower.rgb1.b, flower.rgb1.g)
            
        }
    })
}
}

function  animateMoon(){
    anime.timeline({
        easing: 'cubicBezier(.5, .05, .1, .3)',
        duration: metronome.quaterNoteLength / 2,
        complete: function () {

            var tl2 = anime.timeline({
                easing: 'cubicBezier(.5, .05, .1, .3)',
                duraton: metronome.quaterNoteLength
            })
                .add(({
                    targets: moonRingAnimParms,
                    scale: 1,
                    opacity: 0,
                    loop: false,
                    duration: metronome.quaterNoteLength,

                    update: function () {

                        moonRing.scale.set(moonRingAnimParms.scale, moonRingAnimParms.scale, moonRingAnimParms.scale)
                        moonRing.material.opacity = moonRingAnimParms.opacity;

                    }
                }))
                .add(({
                    targets: moonRingAnimParms,
                    scale: 0,
                    opacity: 1,
                    loop: false,
                    duration: 0,
                    update: function () {

                        moonRing.scale.set(moonRingAnimParms.scale, moonRingAnimParms.scale, moonRingAnimParms.scale)
                        moonRing.material.opacity = moonRingAnimParms.opacity;

                    }
                }))
        }
    })
        .add({
            targets: moonRingAnimParms,
            moonScale: 3,
            easing: 'cubicBezier(.5, .05, .1, .3)',
            duration: metronome.quaterNoteLength / 4,
            update: function () {

                moon.scale.set(500 * moonRingAnimParms.moonScale, 500 * moonRingAnimParms.moonScale, 1);
            }
        })
        .add({
            targets: moonRingAnimParms,
            moonScale: 2,
            easing: 'cubicBezier(.5, .05, .1, .3)',
            duration: metronome.quaterNoteLength / 4,
            update: function () {

                moon.scale.set(500 * moonRingAnimParms.moonScale, 500 * moonRingAnimParms.moonScale, 1);
            }
        })
}



var storyBoard = [{
    tick:35,
    anim:function(){
        animateBloom(3.0,0.0,3.0,0,metronome.quaterNoteLength);
}
},
{
    tick:19,
    anim:function(){
        animateBloom(0.02 ,0.36 ,2.5 ,1.0 ,metronome.quaterNoteLength);
}
},


{
    tick:126,
    anim:function(){
        //    animateBloom(1.15 , 0.33, 1.81, 1, metronome.quaterNoteLength*2)
}
},



{
    tick:60,
    anim: function(){
       // animateBloom(1,0.2,0.8,0,metronome.quaterNoteLength*2)
}
},

{
    tick:70,
    anim:function(){
        animateBloom(1.15 , 0.33, 1.81, 1, metronome.quaterNoteLength*2)
}
},

{tick:37,anim:function(){animateFlowers();}},
{tick:40,anim:function(){animateFlowers();}},
{tick:45,anim:function(){animateFlowers();}},
{tick:50,anim:function(){animateFlowers();}},



{
    tick:32,
    anim: function(){
        animateMoon()
    }
},

{tick:106,anim:function(){animateMoon();}},
{tick:111,anim:function(){animateMoon();}},
{tick:116,anim:function(){animateMoon();}},
{tick:121,anim:function(){animateMoon();}},
{tick:126,anim:function(){animateMoon();}},

{tick:126,anim:function(){ animateBloom(1.15 , 0.33, 1.81, 1, metronome.quaterNoteLength*2)}},


]