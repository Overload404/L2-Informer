//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ENBSeries effect file
// visit http://enbdev.com for updates
// Copyright (c) 2007-2011 Boris Vorontsov
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//+++++++++++++++++++++++++++++
// Internal parameters, can be modified
//+++++++++++++++++++++++++++++
float	EBlurSamplingRange = 4.0;	// not used
float	EApertureScale = 4.0;		// not used

//+++++++++++++++++++++++++++++
// External parameters, do not modify
//+++++++++++++++++++++++++++++
// Keyboard controlled temporary variables (in some versions exists in the config file). Press and hold key 1,2,3...8 together with PageUp or PageDown to modify.
// By default all set to 1.0
float4	tempF1; //0,1,2,3
float4	tempF2; //5,6,7,8
float4	tempF3; //9,0
// x=Width, y=1/Width, z=ScreenScaleY, w=1/ScreenScaleY
float4	ScreenSize;
// x=generic timer in range 0..1, period of 16777216 ms (4.6 hours), w=frame time elapsed (in seconds)
float4	Timer;
// Adaptation delta time for focusing
float	FadeFactor;

// textures
texture2D texColor;
texture2D texDepth;
texture2D texNoise;
texture2D texPalette;
texture2D texFocus; // computed focusing depth
texture2D texCurr; // 4*4 texture for focusing
texture2D texPrev; // 4*4 texture for focusing

sampler2D SamplerColor = sampler_state
{
	Texture   = <texColor>;
	MinFilter = LINEAR;
	MagFilter = LINEAR;
	MipFilter = NONE;
	AddressU  = Mirror;
	AddressV  = Mirror;
	SRGBTexture = FALSE;
	MaxMipLevel = 0;
	MipMapLodBias = 0;
};

sampler2D SamplerDepth = sampler_state
{
	Texture   = <texDepth>;
	MinFilter = POINT;
	MagFilter = POINT;
	MipFilter = NONE;
	AddressU  = Clamp;
	AddressV  = Clamp;
	SRGBTexture = FALSE;
	MaxMipLevel = 0;
	MipMapLodBias = 0;
};

sampler2D SamplerNoise = sampler_state
{
	Texture   = <texNoise>;
	MinFilter = POINT;
	MagFilter = POINT;
	MipFilter = NONE;
	AddressU  = Wrap;
	AddressV  = Wrap;
	SRGBTexture = FALSE;
	MaxMipLevel = 0;
	MipMapLodBias = 0;
};

sampler2D SamplerPalette = sampler_state
{
	Texture   = <texPalette>;
	MinFilter = LINEAR;
	MagFilter = LINEAR;
	MipFilter = NONE;
	AddressU  = Clamp;
	AddressV  = Clamp;
	SRGBTexture = FALSE;
	MaxMipLevel = 0;
	MipMapLodBias = 0;
};

// for focus computation
sampler2D SamplerCurr = sampler_state
{
	Texture   = <texCurr>;
	MinFilter = LINEAR;
	MagFilter = LINEAR;
	MipFilter = LINEAR;
	AddressU  = Clamp;
	AddressV  = Clamp;
	SRGBTexture = FALSE;
	MaxMipLevel = 0;
	MipMapLodBias = 0;
};

// for focus computation
sampler2D SamplerPrev = sampler_state
{
	Texture   = <texPrev>;
	MinFilter = LINEAR;
	MagFilter = LINEAR;
	MipFilter = NONE;
	AddressU  = Clamp;
	AddressV  = Clamp;
	SRGBTexture = FALSE;
	MaxMipLevel = 0;
	MipMapLodBias = 0;
};
// for dof only in PostProcess techniques
sampler2D SamplerFocus = sampler_state
{
	Texture   = <texFocus>;
	MinFilter = LINEAR;
	MagFilter = LINEAR;
	MipFilter = NONE;
	AddressU  = Clamp;
	AddressV  = Clamp;
	SRGBTexture = FALSE;
	MaxMipLevel = 0;
	MipMapLodBias = 0;
};

struct VS_OUTPUT_POST
{
	float4 vpos  : POSITION;
	float2 txcoord : TEXCOORD0;
};

struct VS_INPUT_POST
{
	float3 pos  : POSITION;
	float2 txcoord : TEXCOORD0;
};

////////////////////////////////////////////////////////////////////
// Begin focusing (by Boris Vorontsov)
////////////////////////////////////////////////////////////////////
VS_OUTPUT_POST VS_Focus(VS_INPUT_POST IN)
{
	VS_OUTPUT_POST OUT;

	float4 pos = float4(IN.pos.x,IN.pos.y,IN.pos.z,1.0);

	OUT.vpos = pos;
	OUT.txcoord.xy = IN.txcoord.xy;

	return OUT;
}

//SRCpass1X=ScreenWidth;
//SRCpass1Y=ScreenHeight;
//DESTpass2X=4;
//DESTpass2Y=4;
float4 PS_ReadFocus(VS_OUTPUT_POST IN) : COLOR
{
	float res = tex2D(SamplerDepth, 0.5).x;
	//float3 color = tex2D(SamplerColor, 0.5).rgb;
	res = 0.95;
	return res;
}

//SRCpass1X=4;
//SRCpass1Y=4;
//DESTpass2X=4;
//DESTpass2Y=4;
float4 PS_WriteFocus(VS_OUTPUT_POST IN) : COLOR
{
	float res = 0.0;
	float curr = tex2D(SamplerCurr, 0.5).x;
	float prev = tex2D(SamplerPrev, 0.5).x;

	res = lerp(prev, curr, saturate(FadeFactor));// time elapsed factor
	res = max(res, 0.0);

	return res;
}

technique ReadFocus
{
	pass P0
	{
		VertexShader = compile vs_3_0 VS_Focus();
		PixelShader  = compile ps_3_0 PS_ReadFocus();

		ZEnable = FALSE;
		CullMode = NONE;
		ALPHATESTENABLE = FALSE;
		SEPARATEALPHABLENDENABLE = FALSE;
		AlphaBlendEnable = FALSE;
		FogEnable = FALSE;
		SRGBWRITEENABLE = FALSE;
	}
}

technique WriteFocus
{
	pass P0
	{
		VertexShader = compile vs_3_0 VS_Focus();
		PixelShader  = compile ps_3_0 PS_WriteFocus();

		ZEnable = FALSE;
		CullMode = NONE;
		ALPHATESTENABLE = FALSE;
		SEPARATEALPHABLENDENABLE = FALSE;
		AlphaBlendEnable = FALSE;
		FogEnable = FALSE;
		SRGBWRITEENABLE = FALSE;
	}
}
////////////////////////////////////////////////////////////////////
// End focusing code
////////////////////////////////////////////////////////////////////

/*------------------------------------------------------------------------------
				  ENB prepass modification 2.0.6 by Matso
					   Credits to Boris Vorontsov
------------------------------------------------------------------------------*/
// Effects enabling options
//#define ENABLE_DOF		1			// comment to disable depth of field
#define ENABLE_FAST_DOF	1			// comment to disable fast depth of field (never use both ENABLE_DOF and ENABLE_FAST_DOF - possible game crash or horrible FPS drop)
#define ENABLE_SHARP	1			// comment to disable sharpening
//#define ENABLE_CHROMA	1			// comment to disable chromatic aberration (additional chromatic aberration applied beyond depth of field)

// Methods enabling options
//#define USE_CHROMA_DOF	1			// comment it to disable chromatic aberration sampling in DoF
#define USE_SMOOTH_DOF	1			// comment it to disable smooth DoF
#define USE_BOKEH_DOF	1			// comment it to disable bokeh DoF
//#define USE_ANAMFLARE	1			// comment it to disable anamorphic lens flare (not working very well -_-)
#define USE_DOUBLE_BLUR 1			// comment it to disable additional blur

// Useful constants
#define SEED			Timer.x
#define PI				3.1415926535897932384626433832795
#define CHROMA_POW		65.0								// the bigger the value, the more visible chomatic aberration effect in DoF

// Fast DoF constants
#define DOF_SCALE		2356.1944901923449288469825374596	// PI * 750
#define FIRST_PASS		0	// only 0, 1, 2, or 3
#define SECOND_PASS		1	// only 0, 1, 2, or 3
#define THIRD_PASS		2	// only 0, 1, 2, or 3
#define FOURTH_PASS		3	// only 0, 1, 2, or 3
#define DOF(sd,sf)		fBlurScale * smoothstep(fDofBias, fDofCutoff, abs(sd - sf))
#define USE_NATURAL_BOKEH	1

// Chromatic aberration parameters
float3 fvChroma = float3(0.995, 1.000, 1.005);	// displacement scales of red, green and blue respectively
float fBaseRadius = 0.9;						// below this radius the effect is less visible
float fFalloffRadius = 1.8;						// over this radius the effects is maximal
float fChromaPower = 1.0;						// power of the chromatic displacement (curve of the 'fvChroma' vector)

// Sharpen parameters
float fSharpScale = 0.09;						// intensity of sharpening
float2 fvTexelSize = float2(1.0 / 3840.0, 1.0 / 2160.0);	// set your resolution sizes

// Depth of field parameters
float fFocusBias = 0.048;						// bigger values for nearsightedness, smaller for farsightedness (lens focal point distance)
float fDofCutoff = 0.4;						// manages the smoothness of the DoF (bigger value results in wider depth of field)
float fDofBias = 0.07;							// distance not taken into account in DoF (all closer then the distance is in focus)
float fBlurScale = 0.011;						// governs image blur scale (the bigger value, the stronger blur)
float fBlurCutoff = 0.1;						// bluring tolerance depending on the pixel and sample depth (smaller causes objects edges to be preserved)

// Bokeh parameters
float fBokehCurve = 5.0;						// the larger the value, the more visible the bokeh effect is
float fBokehIntensity = 0.3;					// governs bokeh brightness
float fBokehConstant = 0.3;						// constant value of the bokeh weighting (bigger cause more powerful bokeh)

// Grain parameters
float fGrainFreq = 2000.0;						// movie grain frequency
float fGrainScale = 0.02;						// effect scale

// Anamorphic flare parameters (by default not used)
float fLuminance = 0.85;						// bright pass luminance value 
float fBlur = 2000.0;							// blur amount, manages the size of the flare
float fIntensity = 0.25;						// effect intensity

// External parameters
extern float fWaterLevel = 1.0;					// DO NOT CHANGE - must be 1.0 for now!

/**
 * Chromatic aberration function - given texture coordinate and a focus value
 * retrieves chromatically distorted color of the pixel. Each of the color
 * channels are displaced according to the pixel coordinate and its distance
 * from the center of the image. Also the DoF out-of-focus value is applied.
 * (http://en.wikipedia.org/wiki/Chromatic_aberration)
 */
float4 ChromaticAberration(float2 tex, float outOfFocus)
{
	float d = distance(tex, float2(0.5, 0.5));
	float f = smoothstep(fBaseRadius, fFalloffRadius, d + outOfFocus * d);
	float3 chroma = pow(f + fvChroma, fChromaPower);
	
	float2 tr = ((2.0 * tex - 1.0) * chroma.r) * 0.5 + 0.5;
	float2 tg = ((2.0 * tex - 1.0) * chroma.g) * 0.5 + 0.5;
	float2 tb = ((2.0 * tex - 1.0) * chroma.b) * 0.5 + 0.5;
	
	float3 color = float3(tex2D(SamplerColor, tr).r, tex2D(SamplerColor, tg).g, tex2D(SamplerColor, tb).b) * (1.0 - f);
	
	return float4(color, 1.0);
}

/**
 * Chromatic aberration done accoriding to the focus factor provided.
 */
float4 ChromaticAberrationFocus(float2 tex, float outOfFocus)
{
	float d = distance(tex, float2(0.5, 0.5));
	float f = smoothstep(fBaseRadius, fFalloffRadius, d);
	float3 chroma = pow(f + fvChroma, CHROMA_POW * outOfFocus * fChromaPower);

	float2 tr = ((2.0 * tex - 1.0) * chroma.r) * 0.5 + 0.5;
	float2 tg = ((2.0 * tex - 1.0) * chroma.g) * 0.5 + 0.5;
	float2 tb = ((2.0 * tex - 1.0) * chroma.b) * 0.5 + 0.5;
	
	float3 color = float3(tex2D(SamplerColor, tr).r, tex2D(SamplerColor, tg).g, tex2D(SamplerColor, tb).b) * (1.0 - outOfFocus);
	
	return float4(color, 1.0);
}

/**
 * Pseudo-random number generator - returns a number generated according to the provided vector.
 */
float Random(float2 co)
{
    return frac(sin(dot(co.xy, float2(12.9898, 78.233))) * 43758.5453);
}

/**
 * Movie grain function - returns a random, time scaled value for the given pixel coordinate.
 */
float Grain(float3 tex)
{
	float r = Random(tex.xy);
	float grain = sin(PI * tex.z * r * fGrainFreq) * fGrainScale * r;
	return grain;
}

/**
 * Bright pass - rescales sampled pixel to emboss bright enough value.
 */
float3 BrightPass(float2 tex)
{
	float3 c = tex2D(SamplerColor, tex).rgb;
    float3 bC = max(c - float3(fLuminance, fLuminance, fLuminance), 0.0);
    float bright = dot(bC, 1.0);
    bright = smoothstep(0.0f, 0.5, bright);
    return lerp(0.0, c, bright);
}

float3 BrightColor(float3 c)
{
    float3 bC = max(c - float3(fLuminance, fLuminance, fLuminance), 0.0);
    float bright = dot(bC, 1.0);
    bright = smoothstep(0.0f, 0.5, bright);
    return lerp(0.0, c, bright);
}

/**
 * Anamorphic sampling function - scales pixel coordinate
 * to stratch the image along one of the axels.
 * (http://en.wikipedia.org/wiki/Anamorphosis)
 */
float3 AnamorphicSample(int axis, float2 tex, float blur)
{
	tex = 2.0 * tex - 1.0;
	if (!axis) tex.x /= -blur;
	else tex.y /= -blur;
	tex = 0.5 * tex + 0.5;
	return BrightPass(tex);
}

/**
 * Converts pixel color to gray-scale.
 */
float GrayScale(float3 sample)
{
	return dot(sample, float3(0.3, 0.59, 0.11));
}

/**
 * Returns an under water distortion according to the given coordinate and time factor.
 */
float2 UnderWaterDistortion(float2 coord)
{
	float2 distortion = float2(0.0, 0.0);
	// TODO:...
	
	return coord;// + distortion * (fWaterLevel - 1.0);
}

///// Shaders ////////////////////////////////////////////////////////////////////////////////
// Vertex shader (Boris code)
VS_OUTPUT_POST VS_PostProcess(VS_INPUT_POST IN)
{
	VS_OUTPUT_POST OUT;

	float4 pos = float4(IN.pos.x, IN.pos.y, IN.pos.z, 1.0);

	OUT.vpos = pos;
	OUT.txcoord.xy = IN.txcoord.xy;

	return OUT;
}

// Sharpen pixel shader (Matso code)
float4 PS_ProcessPass_Sharpen(VS_OUTPUT_POST IN, float2 vPos : VPOS) : COLOR
{
	float2 coord = IN.txcoord.xy;
	float4 Color = 9.0 * tex2D(SamplerColor, coord.xy);
	
	Color -= tex2D(SamplerColor, coord.xy + float2(-fvTexelSize.x, fvTexelSize.y) * fSharpScale);
	Color -= tex2D(SamplerColor, coord.xy + float2(0.0, fvTexelSize.y) * fSharpScale);
	Color -= tex2D(SamplerColor, coord.xy + float2(fvTexelSize.x, fvTexelSize.y) * fSharpScale);
	Color -= tex2D(SamplerColor, coord.xy + float2(fvTexelSize.x, 0.0) * fSharpScale);
	Color -= tex2D(SamplerColor, coord.xy + float2(fvTexelSize.x, -fvTexelSize.y) * fSharpScale);
	Color -= tex2D(SamplerColor, coord.xy + float2(0.0, -fvTexelSize.y) * fSharpScale);
	Color -= tex2D(SamplerColor, coord.xy + float2(-fvTexelSize.x, -fvTexelSize.y) * fSharpScale);
	Color -= tex2D(SamplerColor, coord.xy + float2(-fvTexelSize.x, 0.0) * fSharpScale);
	
	Color.a = 1.0;
	return Color;
}

// Anamorphic lens flare pixel shader (Matso code)
float4 PS_ProcessPass_Anamorphic(VS_OUTPUT_POST IN, float2 vPos : VPOS) : COLOR
{
	float4 res;
	float2 coord = IN.txcoord.xy;
	float3 anamFlare = AnamorphicSample(0, coord.xy, fBlur) * float3(0.0, 0.0, 1.0);
	res.rgb = anamFlare * fIntensity;
	res.a = 1.0;
	return res;
}

// Fast depth of field pixel shader (Matso code)
float4 PS_ProcessPass_FastDoF(VS_OUTPUT_POST IN, float2 vPos : VPOS, uniform int axis) : COLOR
{
	float4 res;
	float2 base = UnderWaterDistortion(IN.txcoord.xy);
	float4 tcol = tex2D(SamplerColor, base.xy);
	float sd = tex2D(SamplerDepth, base).x;

#ifndef USE_SMOOTH_DOF
	float sf = tex2D(SamplerDepth, 0.5).x - fFocusBias * fWaterLevel;
#else
	float sf = tex2D(SamplerFocus, 0.5).x - fFocusBias * 2.0 * fWaterLevel;
#endif
	float outOfFocus = DOF(sd, sf);
		
	float offset[4] = { -1.282, -0.524, 0.524, 1.282 };
#ifndef USE_NATURAL_BOKEH
	float2 tds[4] = { float2(1.0, 0.0), float2(0.0, 1.0), float2(0.707, 0.707), float2(-0.707, 0.707) };
#else
	float2 tds[16] = { 
		float2(0.2007, 0.9796),
		float2(-0.2007, 0.9796), 
		float2(0.2007, 0.9796),
		float2(-0.2007, 0.9796), 
		
		float2(0.8240, 0.5665),
		float2(0.5665, 0.8240),
		float2(0.8240, 0.5665),
		float2(0.5665, 0.8240),

		float2(0.9796, 0.2007),
		float2(0.9796, -0.2007),
		float2(0.9796, 0.2007),
		float2(0.9796, -0.2007),
		
		float2(-0.8240, 0.5665),
		float2(-0.5665, 0.8240),
		float2(-0.8240, 0.5665),
		float2(-0.5665, 0.8240)
	};
#endif
	
	float blur = DOF_SCALE * outOfFocus;
	float wValue = 1.0;
	
#ifndef USE_NATURAL_BOKEH
	tdirs[axis].x *= fvTexelSize.x;
	tdirs[axis].y *= fvTexelSize.y;
#endif
	
#ifdef USE_BOKEH_DOF
	blur *= 0.35;
#endif
		
	for (int i = 0; i < 4; i++)
	{
#ifndef USE_NATURAL_BOKEH
		float2 tdir = offset[i] * tds[axis] * blur;
#else
		float2 tdir = tds[axis * 4 + i] * fvTexelSize * offset[i] * blur;
#endif
		
		float2 coord = base + tdir.xy;
#ifdef USE_CHROMA_DOF
		float4 ct = ChromaticAberrationFocus(coord.xy, outOfFocus);
#else
		float4 ct = tex2D(SamplerColor, coord.xy);
#endif
		float sds = tex2D(SamplerDepth, coord).x;

#ifndef USE_BOKEH_DOF
		float w = 1.0 + abs(offset[i]);	// weight blur for better effect
#else		
	#if USE_BOKEH_DOF == 1	// my own bokeh weighting
		float b = GrayScale(ct.rgb) + length(ct.rgb) + fBokehConstant + blur;
		float w = pow(b * fBokehIntensity, fBokehCurve) + abs(offset[i]) + blur;
	#endif
#endif
		w *= (1.0 - smoothstep(0.0, fBlurCutoff, abs(sds - sd)));
		tcol += ct * w;
		wValue += w;
	}

	tcol /= wValue;
		
	res.xyz = tcol.xyz;
	res.w = 1.0;
	return res;
}

// Chromatic abrration with no DoF (Matso code)
float4 PS_ProcessPass_Chroma(VS_OUTPUT_POST IN, float2 vPos : VPOS) : COLOR
{
	float2 coord = IN.txcoord.xy;
	float4 result = ChromaticAberration(coord.xy, 0.0);
	result.a = 1.0;
	return result;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
#ifdef ENABLE_SHARP
	technique PostProcess
	{
		pass P0
		{
			VertexShader = compile vs_3_0 VS_PostProcess();
			PixelShader  = compile ps_3_0 PS_ProcessPass_Sharpen();

			DitherEnable = FALSE;
			ZEnable = FALSE;
			CullMode = NONE;
			ALPHATESTENABLE = FALSE;
			SEPARATEALPHABLENDENABLE = FALSE;
			AlphaBlendEnable = FALSE;
			StencilEnable = FALSE;
			FogEnable = FALSE;
			SRGBWRITEENABLE = FALSE;
		}
		#ifdef USE_ANAMFLARE
			pass P1
			{
				AlphaBlendEnable = true;
				SrcBlend = One;
				DestBlend = One;
				
				PixelShader = compile ps_3_0 PS_ProcessPass_Anamorphic();
			}
		#endif
	}
#endif

#ifndef ENABLE_FAST_DOF
	#ifdef ENABLE_CHROMA
		#ifndef ENABLE_SHARP
			technique PostProcess
		#else
			technique PostProcess2
		#endif
		{
			pass P0
			{
				VertexShader = compile vs_3_0 VS_PostProcess();
				PixelShader  = compile ps_3_0 PS_ProcessPass_Chroma();

				DitherEnable = FALSE;
				ZEnable = FALSE;
				CullMode = NONE;
				ALPHATESTENABLE = FALSE;
				SEPARATEALPHABLENDENABLE = FALSE;
				AlphaBlendEnable = FALSE;
				StencilEnable = FALSE;
				FogEnable = FALSE;
				SRGBWRITEENABLE = FALSE;
			}
		}
	#endif
#endif

#ifndef ENABLE_CHROMA
	#ifdef ENABLE_FAST_DOF
		#ifndef ENABLE_SHARP
			technique PostProcess
		#else
			technique PostProcess2
		#endif
		{
			pass P0
			{
				VertexShader = compile vs_3_0 VS_PostProcess();
				PixelShader  = compile ps_3_0 PS_ProcessPass_FastDoF(FIRST_PASS);

				DitherEnable = FALSE;
				ZEnable = FALSE;
				CullMode = NONE;
				ALPHATESTENABLE = FALSE;
				SEPARATEALPHABLENDENABLE = FALSE;
				AlphaBlendEnable = FALSE;
				StencilEnable = FALSE;
				FogEnable = FALSE;
				SRGBWRITEENABLE = FALSE;
			}
		}

		#ifndef ENABLE_SHARP
			technique PostProcess2
		#else
			technique PostProcess3
		#endif
		{
			pass P0
			{
				VertexShader = compile vs_3_0 VS_PostProcess();
				PixelShader  = compile ps_3_0 PS_ProcessPass_FastDoF(SECOND_PASS);

				DitherEnable = FALSE;
				ZEnable = FALSE;
				CullMode = NONE;
				ALPHATESTENABLE = FALSE;
				SEPARATEALPHABLENDENABLE = FALSE;
				AlphaBlendEnable = FALSE;
				StencilEnable = FALSE;
				FogEnable = FALSE;
				SRGBWRITEENABLE = FALSE;
			}
		}

		#ifdef USE_DOUBLE_BLUR
			#ifndef ENABLE_SHARP
				technique PostProcess3
			#else
				technique PostProcess4
			#endif
			{
				pass P0
				{
					VertexShader = compile vs_3_0 VS_PostProcess();
					PixelShader  = compile ps_3_0 PS_ProcessPass_FastDoF(THIRD_PASS);

					DitherEnable = FALSE;
					ZEnable = FALSE;
					CullMode = NONE;
					ALPHATESTENABLE = FALSE;
					SEPARATEALPHABLENDENABLE = FALSE;
					AlphaBlendEnable = FALSE;
					StencilEnable = FALSE;
					FogEnable = FALSE;
					SRGBWRITEENABLE = FALSE;
				}
			}

			#ifndef ENABLE_SHARP
				technique PostProcess4
			#else
				technique PostProcess5
			#endif
			{
				pass P0
				{
					VertexShader = compile vs_3_0 VS_PostProcess();
					PixelShader  = compile ps_3_0 PS_ProcessPass_FastDoF(FOURTH_PASS);

					DitherEnable = FALSE;
					ZEnable = FALSE;
					CullMode = NONE;
					ALPHATESTENABLE = FALSE;
					SEPARATEALPHABLENDENABLE = FALSE;
					AlphaBlendEnable = FALSE;
					StencilEnable = FALSE;
					FogEnable = FALSE;
					SRGBWRITEENABLE = FALSE;
				}
			}
		#endif
	#endif
#endif
