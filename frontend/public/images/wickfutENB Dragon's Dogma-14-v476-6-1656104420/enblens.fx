//++++++++++++++++++++++++++++++++++++++++++++
// ENBSeries effect file
// visit http://enbdev.com for updates
// Copyright (c) 2007-2013 Boris Vorontsov
//++++++++++++++++++++++++++++++++++++++++++++



//+++++++++++++++++++++++++++++
//internal parameters, can be modified
//+++++++++++++++++++++++++++++
//none



//+++++++++++++++++++++++++++++
//external parameters, do not modify
//+++++++++++++++++++++++++++++
//keyboard controlled temporary variables (in some versions exists in the config file). Press and hold key 1,2,3...8 together with PageUp or PageDown to modify. By default all set to 1.0
float4	tempF1; //0,1,2,3
float4	tempF2; //5,6,7,8
float4	tempF3; //9,0
//x=Width, y=1/Width, z=ScreenScaleY, w=1/ScreenScaleY
float4	ScreenSize;
//changes in range 0..1, 0 means that night time, 1 - day time
float	ENightDayFactor;
//changes 0 or 1. 0 means that exterior, 1 - interior
float	EInteriorFactor;
//x=generic timer in range 0..1, period of 16777216 ms (4.6 hours), w=frame time elapsed (in seconds)
float4	Timer;
//additional info for computations
float4	TempParameters; 
//x=reflection intensity, y=reflection power, z=dirt intensity, w=dirt power
float4	LensParameters;
//fov in degrees
float	FieldOfView;



texture2D texColor;
texture2D texMask;//enblensmask texture
texture2D texBloom1;
texture2D texBloom2;
texture2D texBloom3;
texture2D texBloom4;
texture2D texBloom5;
texture2D texBloom6;
texture2D texBloom7;
texture2D texBloom8;

sampler2D SamplerColor = sampler_state
{
	Texture   = <texColor>;
	MinFilter = LINEAR;
	MagFilter = LINEAR;
	MipFilter = NONE;
	AddressU  = Clamp;
	AddressV  = Clamp;
	SRGBTexture=FALSE;
	MaxMipLevel=0;
	MipMapLodBias=0;
};

sampler2D SamplerMask = sampler_state
{
	Texture   = <texMask>;
	MinFilter = LINEAR;
	MagFilter = LINEAR;
	MipFilter = NONE;
	AddressU  = Clamp;
	AddressV  = Clamp;
	SRGBTexture=FALSE;
	MaxMipLevel=0;
	MipMapLodBias=0;
};

sampler2D SamplerBloom1 = sampler_state
{
	Texture   = <texBloom1>;
	MinFilter = LINEAR;
	MagFilter = LINEAR;
	MipFilter = NONE;
	AddressU  = Clamp;
	AddressV  = Clamp;
	SRGBTexture=FALSE;
	MaxMipLevel=0;
	MipMapLodBias=0;
};

sampler2D SamplerBloom2 = sampler_state
{
	Texture   = <texBloom2>;
	MinFilter = LINEAR;
	MagFilter = LINEAR;
	MipFilter = NONE;
	AddressU  = Clamp;
	AddressV  = Clamp;
	SRGBTexture=FALSE;
	MaxMipLevel=0;
	MipMapLodBias=0;
};

sampler2D SamplerBloom3 = sampler_state
{
	Texture   = <texBloom3>;
	MinFilter = LINEAR;
	MagFilter = LINEAR;
	MipFilter = NONE;
	AddressU  = Clamp;
	AddressV  = Clamp;
	SRGBTexture=FALSE;
	MaxMipLevel=0;
	MipMapLodBias=0;
};

sampler2D SamplerBloom4 = sampler_state
{
	Texture   = <texBloom4>;
	MinFilter = LINEAR;
	MagFilter = LINEAR;
	MipFilter = NONE;
	AddressU  = Clamp;
	AddressV  = Clamp;
	SRGBTexture=FALSE;
	MaxMipLevel=0;
	MipMapLodBias=0;
};

sampler2D SamplerBloom5 = sampler_state
{
	Texture   = <texBloom5>;
	MinFilter = LINEAR;
	MagFilter = LINEAR;
	MipFilter = NONE;
	AddressU  = Clamp;
	AddressV  = Clamp;
	SRGBTexture=FALSE;
	MaxMipLevel=0;
	MipMapLodBias=0;
};

sampler2D SamplerBloom6 = sampler_state
{
	Texture   = <texBloom6>;
	MinFilter = LINEAR;
	MagFilter = LINEAR;
	MipFilter = NONE;
	AddressU  = Clamp;
	AddressV  = Clamp;
	SRGBTexture=FALSE;
	MaxMipLevel=0;
	MipMapLodBias=0;
};

sampler2D SamplerBloom7 = sampler_state
{
	Texture   = <texBloom7>;
	MinFilter = LINEAR;
	MagFilter = LINEAR;
	MipFilter = NONE;
	AddressU  = Clamp;
	AddressV  = Clamp;
	SRGBTexture=FALSE;
	MaxMipLevel=0;
	MipMapLodBias=0;
};

sampler2D SamplerBloom8 = sampler_state
{
	Texture   = <texBloom8>;
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



//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
VS_OUTPUT_POST VS_Draw(VS_INPUT_POST IN)
{
	VS_OUTPUT_POST OUT;

	OUT.vpos=float4(IN.pos.x,IN.pos.y,IN.pos.z,1.0);

	OUT.txcoord0.xy=IN.txcoord0.xy+TempParameters.xy;//1.0/(bloomtexsize*2.0)

	return OUT;
}



float4	PS_Draw(VS_OUTPUT_POST In) : COLOR
{
	float4	res=0.0;

	float2	coord;
	//deepness, curvature, inverse size
	const float3 offset[4]=
	{
		float3(1.6, 4.0, 1.0),
		float3(0.7, 0.25, 2.0),
		float3(0.3, 1.5, 0.5),
		float3(-0.5, 1.0, 1.0)
	};
	//color filter per reflection
	const float3 factors[4]=
	{
		float3(0.3, 0.4, 0.4),
		float3(0.2, 0.4, 0.5),
		float3(0.5, 0.3, 0.7),
		float3(0.1, 0.2, 0.7)
	};

	for (int i=0; i<4; i++)
	{
		float2	distfact=(In.txcoord0.xy-0.5);
		coord.xy=offset[i].x*distfact;
		coord.xy*=pow(2.0*length(float2(distfact.x*ScreenSize.z,distfact.y)), offset[i].y);
		coord.xy*=offset[i].z;
		coord.xy=0.5-coord.xy;//v1
//		coord.xy=In.txcoord0.xy-coord.xy;//v2
		float3	templens=tex2D(SamplerBloom2, coord.xy);
		templens=templens*factors[i];
		distfact=(coord.xy-0.5);
		distfact*=2.0;
		templens*=saturate(1.0-dot(distfact,distfact));//limit by uv 0..1
//		templens=factors[i] * (1.0-dot(distfact,distfact));
		float	maxlens=max(templens.x, max(templens.y, templens.z));
//		float3	tempnor=(templens.xyz/maxlens);
//		tempnor=pow(tempnor, tempF1.z);
//		templens.xyz=tempnor.xyz*maxlens;
		float	tempnor=(maxlens/(1.0+maxlens));
		tempnor=pow(tempnor, LensParameters.y);
		templens.xyz*=tempnor;

		res.xyz+=templens;
	}
	res.xyz*=0.25*LensParameters.x;


	//add mask
	{
		coord=In.txcoord0.xy;
		coord.y*=ScreenSize.w;//remove stretching of image
		float4	mask=tex2D(SamplerMask, coord);
		float3	templens=tex2D(SamplerBloom6, In.txcoord0.xy);
		float	maxlens=max(templens.x, max(templens.y, templens.z));
		float	tempnor=(maxlens/(1.0+maxlens));
		tempnor=pow(tempnor, LensParameters.w);
		templens.xyz*=tempnor * LensParameters.z;
		res.xyz+=mask.xyz * templens.xyz;
	}

	return res;
}


//blurring may required when quality of blurring is too bad for bilinear filtering on screen
float4	PS_LensPostPass(VS_OUTPUT_POST In) : COLOR
{
	float4	res=0.0;
/*
	//blur
	const float2 offset[4]=
	{
		float2( 1.25, 1.25),
		float2( 1.25,-1.25),
		float2(-1.25, 1.25),
		float2(-1.25,-1.25)
	};
	//float2	screenfact=TempParameters.y;
	//screenfact.y*=ScreenSize.z;
	float2	screenfact=ScreenSize.y;
	screenfact.y*=ScreenSize.z;
	for (int i=0; i<4; i++)
	{
		float2	coord=offset[i].xy*screenfact.xy+In.txcoord0.xy;
		res.xyz+=tex2D(SamplerColor, coord);
	}
	res.xyz*=0.25;
	res.xyz=min(res.xyz, 32768.0);
	res.xyz=max(res.xyz, 0.0);
*/
	//no blur
	res=tex2D(SamplerColor, In.txcoord0.xy);
	res.xyz=min(res.xyz, 32768.0);
	res.xyz=max(res.xyz, 0.0);

	return res;
}



//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//actual computation, draw all effects to small texture
technique Draw
{
    pass p0
    {
	VertexShader = compile vs_3_0 VS_Draw();
	PixelShader  = compile ps_3_0 PS_Draw();

	ColorWriteEnable=ALPHA|RED|GREEN|BLUE;
	CullMode=NONE;
	AlphaBlendEnable=FALSE;
	AlphaTestEnable=FALSE;
	SeparateAlphaBlendEnable=FALSE;
	SRGBWriteEnable=FALSE;
	}
}



//final pass, output to screen with additive blending and no alpha
technique LensPostPass
{
    pass p0
    {
	VertexShader = compile vs_3_0 VS_Draw();
	PixelShader  = compile ps_3_0 PS_LensPostPass();

	AlphaBlendEnable=TRUE;
	SrcBlend=ONE;
	DestBlend=ONE;
	ColorWriteEnable=RED|GREEN|BLUE;//warning, no alpha output!
	CullMode=NONE;
	AlphaTestEnable=FALSE;
	SeparateAlphaBlendEnable=FALSE;
	SRGBWriteEnable=FALSE;
	}
}
