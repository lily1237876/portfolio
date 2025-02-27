// output n-th root of a number
export function nRoot(x, n) {
    return Math.pow(x, 1 / n);
}

// output the fractional part of a number
export function fract(x) {
    return x - Math.floor(x);
}

// clamps a number ∈ [low, high]
export function clamp(x, low, high) {
    return Math.min(Math.max(x, low), high);
}

// output a number ∈ [a, b]; when n === 0, output a; when n === 1, output b
export function mix(a, b, n) {
    n = clamp(n, 0, 1);
    return a * (1 - n) + b * n;
}

// inverse function of mix(), output a number ∈ [0, 1]; when x === low, output 0; when x === b, output 1
export function remap01(x, low, high) {
    return clamp((x - low) / (high - low), 0, 1);
}

// remaps x from [lowIn, highIn] to [lowOut, highOut]
export function remap(x, lowIn, highIn, lowOut, highOut) {
    return mix(lowOut, highOut, remap01(x, lowIn, highIn));
}

export function even2(a) { // make input a: 1. an even number; 2. at least 2
    return Math.ceil(Math.max(a, 2) / 2) * 2;
}

/**
 * function that generates an s-curve ∈ [0, 1], sort of like:
 __
 /
 |
 __/
 * a ∈ [2, 4, 6, 8, 10, ...]. a ↑ --> curve approaches y = x
 **/
export function remap01CurveS(x, low, high, a = 2) {
    let r = remap01(x, low, high);
    a = even2(a);
    return (1 - r) * Math.pow(r, a) + r * (-Math.pow(r - 1, a) + 1);
}

export function remapCurveS(x, lowIn, highIn, lowOut, highOut, a = 2) {
    return mix(lowOut, highOut, remap01CurveS(x, lowIn, highIn, a));
}

/**
 * function that generates a curve within [0, 1] that assends faster when approaching 1, sort of like:
 |
 |
 /
 __
 * a ∈ [2, 4, 6, 8, 10, ...]. a ↑ --> curve initial slope becomes smaller
 **/
export function remap01CurveEaseIn1(x, low, high, a = 2) {
    let r = remap01(x, low, high);
    a = even2(a);
    return -nRoot(1 - r, a) + 1;
}

export function remapCurveEaseIn1(x, lowIn, highIn, lowOut, highOut, a = 2) {
    return mix(lowOut, highOut, remap01CurveEaseIn1(x, lowIn, highIn, a));
}

export function remap01CurveEaseIn2(x, low, high, a = 6) {
    let r = remap01(x, low, high);
    return Math.pow(r, a);
}
export function remapCurveEaseIn2(x, lowIn, highIn, lowOut, highOut, a = 6) {
    return mix(lowOut, highOut, remap01CurveEaseIn2(x, lowIn, highIn, a));
}

/**
 * function that generates a curve within [0, 1] that tapers off, sort of like:
 __
 /
 |
 |
 * a ∈ [2, 4, 6, 8, 10, ...]. a ↑ --> curve initial slope becomes bigger
 **/
export function remap01CurveEaseOut1(x, low, high, a = 2) {
    let r = remap01(x, low, high);
    a = even2(a);
    return -Math.pow(r - 1, a) + 1;
}
export function remapCurveEaseOut1(x, lowIn, highIn, lowOut, highOut, a = 2) {
    return mix(lowOut, highOut, remap01CurveEaseOut1(x, lowIn, highIn, a));
}


export function remap01CurveEaseOut2(x, low, high, a = 2) {
    let r = remap01(x, low, high);
    a = even2(a);
    return -Math.pow(r - 1, a) + 1;
}
export function remapCurveEaseOut2(x, lowIn, highIn, lowOut, highOut, a = 2) {
    return mix(lowOut, highOut, remap01CurveEaseOut2(x, lowIn, highIn, a));
}

export function smoothstep(a, b, x) {
    let l = remap01(x, a, b);
    return 3 * l * l - 2 * l * l * l;
}

export function expSustainedImpulse( x, f, k )
{
    let s = Math.max(x-f,0.0);
    return Math.min( x*x/(f*f), 1.0+(2.0/f)*s*Math.exp(-k*s));
}

export function parabola(x, m) {
    x = clamp(x, 0, 1);
    return Math.pow(4 * x * (1 - x), m);
}

export const mathUtilShader = `
    float remap01(float x, float low, float high) {
        return clamp((x - low) / (high - low), 0., 1.);
    }
    
    float remap(float x, float lowIn, float highIn, float lowOut, float highOut) {
        return mix(lowOut, highOut, remap01(x, lowIn, highIn));
    }
    
    float remap01CurveEaseIn2(float x, float low, float high, float a) {
        float r = remap01(x, low, high);
        return pow(r, a);
    }
    
    float remapCurveEaseIn2(float x, float lowIn, float highIn, float lowOut, float highOut, float a) {
        return mix(lowOut, highOut, remap01CurveEaseIn2(x, lowIn, highIn, a));
    }
    
    float remap01CurveEaseIn2Reverse(float x, float low, float high, float a) {
        float r = remap01(x, low, high);
        return pow(1. - r, a);
    }
    
    float remapCurveEaseIn2Reverse(float x, float lowIn, float highIn, float lowOut, float highOut, float a) {
        return mix(lowOut, highOut, remap01CurveEaseIn2Reverse(x, lowIn, highIn, a));
    }
    
    float parabola( float x, float k )
    {
        x = remap01(x, 0., 1.);
        return pow( 4.0*x*(1.0-x), k );
    }
    
    float parabolaReverse( float x, float k )
    {
        return 1. - parabola(x, k);
    }
`;
