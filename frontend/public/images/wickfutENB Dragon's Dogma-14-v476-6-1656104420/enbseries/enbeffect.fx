//++++++++++++++++++++++++++++++++++++++++++++
// ENBSeries effect file
// visit http://enbdev.com for updates
// Copyright (c) 2007-2016 Boris Vorontsov
//++++++++++++++++++++++++++++++++++++++++++++



//post processing mode. Change value (could be 1, 2, 3, 4). Every mode have own internal parameters, look below
#ifndef POSTPROCESS
 #define POSTPROCESS	2
#endif



//+++++++++++++++++++++++++++++
//internal parameters, can be modified
//+++++++++++++++++++++++++++++
//modify these values to tweak various color processing
/*
float	EAdaptationMin
<
	string UIName="Adaptation: Min";
	string UIWidget="Spinner";
	float UIMin=0.0;
	float UIMax=100.0;
> = {1.0};

float	EAdaptationMax
<
	string UIName="Adaptation: Max";
	string UIWidget="Spinner";
	float UIMin=0.0;
	float UIMax=100.0;
> = {1.0};
*/
float	EBloomContrast
<
	string UIName="Bloom: Contrast";
	string UIWidget="Spinner";
	float UIMin=0.5;
	float UIMax=4.0;
> = {1.5};

float	EBrightness
<
	string UIName="Tonemapping: Brightness";
	string UIWidget="Spinner";
	float UIMin=0.0;
	float UIMax=100.0;
> = {1.0};

float	EToneMappingCurve
<
	string UIName="Tonemapping: Curve";
	string UIWidget="Spinner";
	float UIMin=0.0;
	float UIMax=100.0;
> = {1.0};

float	EIntensityContrast
<
	string UIName="Tonemapping: IntensityContrast";
	string UIWidget="Spinner";
	float UIMin=0.0;
	float UIMax=100.0;
> = {1.0};

float	EColorSaturation
<
	string UIName="Tonemapping: ColorSaturation";
	string UIWidget="Spinner";
	float UIMin=0.0;
	float UIMax=1.0;
> = {1.0};

float	EOversaturation
<
	string UIName="Tonemapping: Oversaturation";
	string UIWidget="Spinner";
	float UIMin=0.0;
	float UIMax=100.0;
> = {1.0};



#ifdef E_CC_PROCEDURAL
//parameters for ldr color correction, if enabled
float	ECCGamma
<
	string UIName="CC: Gamma";
	string UIWidget="Spinner";
	float UIMin=0.2;//not zero!!!
	float UIMax=5.0;
> = {1.0};

float	ECCInBlack
<
	string UIName="CC: In black";
	string UIWidget="Spinner";
	float UIMin=0.0;
	float UIMax=1.0;
> = {0.0};

float	ECCInWhite
<
	string UIName="CC: In white";
	string UIWidget="Spinner";
	float UIMin=0.0;
	float UIMax=1.0;
> = {1.0};

float	ECCOutBlack
<
	string UIName="CC: Out black";
	string UIWidget="Spinner";
	float UIMin=0.0;
	float UIMax=1.0;
> = {0.0};

float	ECCOutWhite
<
	string UIName="CC: Out white";
	string UIWidget="Spinner";
	float UIMin=0.0;
	float UIMax=1.0;
> = {1.0};

float	ECCBrightness
<
	string UIName="CC: Brightness";
	string UIWidget="Spinner";
	float UIMin=0.0;
	float UIMax=10.0;
> = {1.0};

float	ECCContrastGrayLevel
<
	string UIName="CC: Contrast gray level";
	string UIWidget="Spinner";
	float UIMin=0.01;
	float UIMax=0.99;
> = {0.5};

float	ECCContrast
<
	string UIName="CC: Contrast";
	string UIWidget="Spinner";
	float UIMin=0.0;
	float UIMax=10.0;
> = {1.0};

float	ECCSaturation
<
	string UIName="CC: Saturation";
	string UIWidget="Spinner";
	float UIMin=0.0;
	float UIMax=10.0;
> = {1.0};

float	ECCDesaturateShadows
<
	string UIName="CC: Desaturate shadows";
	string UIWidget="Spinner";
	float UIMin=0.0;
	float UIMax=1.0;
> = {0.0};

float3	ECCColorBalanceShadows <
	string UIName="CC: Color balance shadows";
	string UIWidget="Color";
> = {0.5, 0.5, 0.5};

float3	ECCColorBalanceHighlights <
	string UIName="CC: Color balance highlights";
	string UIWidget="Color";
> = {0.5, 0.5, 0.5};

float3	ECCChannelMixerR <
	string UIName="CC: Channel mixer R";
	string UIWidget="Color";
> = {1.0, 0.0, 0.0};

float3	ECCChannelMixerG <
	string UIName="CC: Channel mixer G";
	string UIWidget="Color";
> = {0.0, 1.0, 0.0};

float3	ECCChannelMixerB <
	string UIName="CC: Channel mixer B";
	string UIWidget="Color";
> = {0.0, 0.0, 1.0};
#endif //E_CC_PROCEDURAL



//+++++++++++++++++++++++++++++
//external parameters, do not modify
//+++++++++++++++++++++++++++++
//keyboard controlled temporary variables (in some versions exists in the config file). Press and hold key 1,2,3...8 together with PageUp or PageDown to modify. By default all set to 1.0
float4	tempF1; //0,1,2,3
float4	tempF2; //5,6,7,8
float4	tempF3; //9,0
//x=generic timer in range 0..1, period of 16777216 ms (4.6 hours), w=frame time elapsed (in seconds)
float4	Timer;
//x=Width, y=1/Width, z=ScreenScaleY, w=1/ScreenScaleY
float4	ScreenSize;
//changes in range 0..1, 0 means that night time, 1 - day time
float	ENightDayFactor;
//changes 0 or 1. 0 means that exterior, 1 - interior
float	EInteriorFactor;
//changes in range 0..1, 0 means full quality, 1 lowest dynamic quality (0.33, 0.66 are limits for quality levels)
//float	EAdaptiveQualityFactor;
//.x - current weather index, .y - outgoing weather index, .z - weather transition, .w - time of the day in 24 standart hours. Weather index is value from _weatherlist.ini, for example WEATHER002 means index==2, but index==0 means that weather not captured.
//float4	WeatherAndTime;
//enb version of bloom applied, ignored if original post processing used
float	EBloomAmount;
//fov in degrees
//float	FieldOfView;



texture2D texs0;//color
texture2D texs3;//bloom enb
texture2D texs4;//adaptation enb
texture2D texs7;//palette enb

sampler2D _s0 = sampler_state
{
	Texture   = <texs0>;
	MinFilter = POINT;
	MagFilter = POINT;
	MipFilter = NONE;
	AddressU  = Clamp;
	AddressV  = Clamp;
	SRGBTexture=FALSE;
	MaxMipLevel=0;
	MipMapLodBias=0;
};

sampler2D _s3 = sampler_state
{
	Texture   = <texs3>;
	MinFilter = LINEAR;
	MagFilter = LINEAR;
	MipFilter = NONE;
	AddressU  = Clamp;
	AddressV  = Clamp;
	SRGBTexture=FALSE;
	MaxMipLevel=0;
	MipMapLodBias=0;
};

sampler2D _s4 = sampler_state
{
	Texture   = <texs4>;
	MinFilter = LINEAR;
	MagFilter = LINEAR;
	MipFilter = NONE;
	AddressU  = Clamp;
	AddressV  = Clamp;
	SRGBTexture=FALSE;
	MaxMipLevel=0;
	MipMapLodBias=0;
};

sampler2D _s7 = sampler_state
{
	Texture   = <texs7>;
	MinFilter = LINEAR;
	MagFilter = LINEAR;
	MipFilter = NONE;
	AddressU  = Clamp;
	AddressV  = Clamp;
	SRGBTexture=FALSE;
	MaxMipLevel=0;
	MipMapLodBias=0;
};

struct VS_OUTPUT_POST
{
	float4 vpos  : POSITION;
	float2 txcoord0 : TEXCOORD0;
};
struct VS_INPUT_POST
{
	float3 pos  : POSITION;
	float2 txcoord0 : TEXCOORD0;
};



//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
VS_OUTPUT_POST VS_Quad(VS_INPUT_POST IN)
{
	VS_OUTPUT_POST OUT;

	OUT.vpos=float4(IN.pos.x,IN.pos.y,IN.pos.z,1.0);
	OUT.txcoord0.xy=IN.txcoord0.xy;

	return OUT;
}



float4	PS_Draw(VS_OUTPUT_POST IN, float2 vPos : VPOS) : COLOR
{
	float4	_oC0=0.0;


	//+++ read frame color
	float4	color=tex2D(_s0, IN.txcoord0.xy); //color texture


	//+++ apply bloom
	float4	bloom=tex2D(_s3, IN.txcoord0.xy); //bloom texture

	float	bloomgray=max(bloom.x, max(bloom.y, bloom.z));
	bloomgray=max(bloomgray, 0.0000000001);
	float3	bloomcolor=bloom.xyz / bloomgray;
	bloomgray=pow(bloomgray, EBloomContrast);
	bloom.xyz=bloomcolor.xyz * bloomgray;

	//v1 classic additive bloom
	color.xyz+=bloom * EBloomAmount;
	//v2
//	bloom.xyz=bloom-color;
//	bloom.xyz=max(bloom, 0.0);
//	color.xyz+=bloom * EBloomAmount;

/*
	//better to disable, because not required for Dragon's Dogma with it's dark nights
	//+++ apply brightness adaptation
	float4	Adaptation=tex2D(_s4, 0.5); //adaptation texture
	float	grayadaptation=max(max(Adaptation.x, Adaptation.y), Adaptation.z);
	grayadaptation=max(grayadaptation, 0.0);
	grayadaptation=min(grayadaptation, 100.0);
	color.xyz=color.xyz / (grayadaptation*EAdaptationMax + EAdaptationMin);
*/

	//+++ tonemapping and color ops
	color.xyz*=EBrightness;
	float	maxgray=max(color.x, max(color.y, color.z));
	maxgray+=0.000001;
	float3	normalizedcolor=color.xyz / maxgray;
	normalizedcolor=lerp(1.0, normalizedcolor, EColorSaturation);
	maxgray=pow(maxgray, EIntensityContrast);
	color.xyz=normalizedcolor * maxgray;
	color.xyz=color.xyz / (color.xyz * EOversaturation + EToneMappingCurve);


#ifdef E_CC_PALETTE
	float2 CLut_pSize = float2(0.00390625, 0.0625);// 1 / float2(256, 16);
	color.rgb = saturate(color.rgb);
	color.b *= 15;
	float4 CLut_UV = 0;
	CLut_UV.w = floor(color.b);
	CLut_UV.xy = color.rg * 15 * CLut_pSize + 0.5 * CLut_pSize ;
	CLut_UV.x += CLut_UV.w * CLut_pSize.y;
	color.rgb = lerp( tex2Dlod(_s7, CLut_UV.xyzz).rgb, tex2Dlod(_s7, CLut_UV.xyzz + float4(CLut_pSize.y, 0, 0, 0)).rgb, color.b - CLut_UV.w);
#endif //E_CC_PALETTE



#ifdef E_CC_PROCEDURAL
	//+++ ldr color correction math
	float	tempgray;
	float4	tempvar;
	float3	tempcolor;

	//+++ levels like in photoshop, including gamma, lightness, additive brightness
	color=max(color-ECCInBlack, 0.0) / max(ECCInWhite-ECCInBlack, 0.0001);
	if (ECCGamma!=1.0) color=pow(color, ECCGamma);
	color=color*(ECCOutWhite-ECCOutBlack) + ECCOutBlack;

	//+++ brightness
	color=color*ECCBrightness;

	//+++ contrast
	color=(color-ECCContrastGrayLevel) * ECCContrast + ECCContrastGrayLevel;

	//+++ saturation
	tempgray=dot(color, 0.3333);
	color=lerp(tempgray, color, ECCSaturation);

	//+++ desaturate shadows
	tempgray=dot(color, 0.3333);
	tempvar.x=saturate(1.0-tempgray);
	tempvar.x*=tempvar.x;
	tempvar.x*=tempvar.x;
	color=lerp(color, tempgray, ECCDesaturateShadows*tempvar.x);

	//+++ color balance
	color=saturate(color);
	tempgray=dot(color, 0.3333);
	float2	shadow_highlight=float2(1.0-tempgray, tempgray);
	shadow_highlight*=shadow_highlight;
	color.rgb+=(ECCColorBalanceHighlights*2.0-1.0)*color * shadow_highlight.x;
	color.rgb+=(ECCColorBalanceShadows*2.0-1.0)*(1.0-color) * shadow_highlight.y;

	//+++ channel mixer
	tempcolor=color;
	color.r=dot(tempcolor, ECCChannelMixerR);
	color.g=dot(tempcolor, ECCChannelMixerG);
	color.b=dot(tempcolor, ECCChannelMixerB);
#endif //E_CC_PROCEDURAL


	_oC0.w=1.0;
	_oC0.xyz=color.xyz;
	return _oC0;
}



//switch between vanilla and mine post processing
technique Draw <string UIName="ENBSeries";>
{
	pass p0
	{
		VertexShader= compile vs_3_0 VS_Quad();
		PixelShader = compile ps_3_0 PS_Draw();

		ColorWriteEnable=ALPHA|RED|GREEN|BLUE;
		ZEnable=FALSE;
		ZWriteEnable=FALSE;
		CullMode=NONE;
		AlphaTestEnable=FALSE;
		AlphaBlendEnable=FALSE;
	}
}



float4 PS_Vanilla(VS_OUTPUT_POST IN, float2 vPos : VPOS) : COLOR
{
	//+++ read frame color
	float4	color=tex2D(_s0, IN.txcoord0.xy); //color texture

	//+++ apply bloom
	float4	bloom=tex2D(_s3, IN.txcoord0.xy); //bloom texture

	float	bloomgray=max(bloom.x, max(bloom.y, bloom.z));
	bloomgray=max(bloomgray, 0.0000000001);
	float3	bloomcolor=bloom.xyz / bloomgray;
	bloomgray=pow(bloomgray, EBloomContrast);
	bloom.xyz=bloomcolor.xyz * bloomgray;

	//v1 classic additive bloom
	color.xyz+=bloom * EBloomAmount;

	return color;
//	return tex2D(_s0, IN.txcoord0.xy);
}

//original shader of post processing
technique Shader_ORIGINALPOSTPROCESS <string UIName="Vanilla";>
{
	pass p0
	{
		VertexShader= compile vs_3_0 VS_Quad();
		PixelShader = compile ps_3_0 PS_Vanilla();

		ColorWriteEnable=ALPHA|RED|GREEN|BLUE;
		ZEnable=FALSE;
		ZWriteEnable=FALSE;
		CullMode=NONE;
		AlphaTestEnable=FALSE;
		AlphaBlendEnable=FALSE;
    }
}

