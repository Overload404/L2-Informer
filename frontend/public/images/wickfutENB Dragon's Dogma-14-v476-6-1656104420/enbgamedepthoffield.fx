//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ENBSeries effect file
// visit http://enbdev.com for updates
// Copyright (c) 2007-2016 Boris Vorontsov
//
//This is game dof replacement example. File standard is similar
//to enbeffectprepass.fx for DX9 version of ENBSeries modification,
//but it ignores ReadFocus and WriteFocus techniques. Focus texture
//is set as precomputed mask of how much depth of field to apply.
//If it black, then no depth of field, otherwise amount of blurring
//or radius of blurring (depends from dof implementation here).
//Negative value of focusing texture is before focus distance (near)
//and positive value is far focusing.
//Focusing distance not exist at all, could be several focused areas,
//so this is more like depth based blur than depth of field.
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

#ifndef E_DOF_EQ
 #ifndef E_DOF_HQ
  #ifndef E_DOF_MQ
   #ifndef E_DOF_LQ
#define E_DOF_MQ
   #endif
  #endif
 #endif
#endif


//+++++++++++++++++++++++++++++
//internal parameters, can be modified
//+++++++++++++++++++++++++++++
//add here something


//+++++++++++++++++++++++++++++
//external parameters, do not modify
//+++++++++++++++++++++++++++++
//keyboard controlled temporary variables (in some versions exists in the config file). Press and hold key 1,2,3...8 together with PageUp or PageDown to modify. By default all set to 1.0
float4	tempF1; //0,1,2,3
float4	tempF2; //5,6,7,8
float4	tempF3; //9,0
//x=Width, y=1/Width, z=ScreenScaleY, w=1/ScreenScaleY
float4	ScreenSize;
//x=generic timer in range 0..1, period of 16777216 ms (4.6 hours), w=frame time elapsed (in seconds)
float4	Timer;
//changes in range 0..1, 0 means that night time, 1 - day time
float	ENightDayFactor;
//changes 0 or 1. 0 means that exterior, 1 - interior
float	EInteriorFactor;
//adaptation delta time for focusing
float	FadeFactor; //unused, but let it be for compatibility with old dof shaders
//fov in degrees
float	FieldOfView; //unused yet in Dragon's Dogma



//textures
texture2D texOriginal; //always the same image of scene
texture2D texColor; //swapped image of scene with previously drawed technique
texture2D texDepth;
texture2D texNoise;
texture2D texPalette;
texture2D texFocus; //game defined amount of depth of field

sampler2D SamplerOriginal = sampler_state
{
	Texture   = <texOriginal>;
	MinFilter = LINEAR;
	MagFilter = LINEAR;
	MipFilter = NONE;
	AddressU  = Clamp;
	AddressV  = Clamp;
	SRGBTexture=FALSE;
};

sampler2D SamplerColor = sampler_state
{
	Texture   = <texColor>;
	MinFilter = LINEAR;
	MagFilter = LINEAR;
	MipFilter = NONE;
	AddressU  = Clamp;
	AddressV  = Clamp;
	SRGBTexture=FALSE;
};

sampler2D SamplerDepth = sampler_state
{
	Texture   = <texDepth>;
	MinFilter = POINT;
	MagFilter = POINT;
	MipFilter = NONE;
	AddressU  = Clamp;
	AddressV  = Clamp;
	SRGBTexture=FALSE;
};

sampler2D SamplerNoise = sampler_state
{
	Texture   = <texNoise>;
	MinFilter = POINT;
	MagFilter = POINT;
	MipFilter = NONE;
	AddressU  = Wrap;
	AddressV  = Wrap;
	SRGBTexture=FALSE;
};

sampler2D SamplerPalette = sampler_state
{
	Texture   = <texPalette>;
	MinFilter = LINEAR;
	MagFilter = LINEAR;
	MipFilter = NONE;
	AddressU  = Clamp;
	AddressV  = Clamp;
	SRGBTexture=FALSE;
};

sampler2D SamplerFocus = sampler_state
{
	Texture   = <texFocus>;
	MinFilter = LINEAR;
	MagFilter = LINEAR;
	MipFilter = NONE;
	AddressU  = Clamp;
	AddressV  = Clamp;
	SRGBTexture=FALSE;
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



//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
VS_OUTPUT_POST VS_PostProcess(VS_INPUT_POST IN)
{
	VS_OUTPUT_POST OUT;

	float4 pos=float4(IN.pos.x,IN.pos.y,IN.pos.z,1.0);

	OUT.vpos=pos;
	OUT.txcoord.xy=IN.txcoord.xy;

	return OUT;
}



//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//remove alpha
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
float4	PS_ZeroAlpha(VS_OUTPUT_POST IN, float2 vPos : VPOS) : COLOR
{
	float4	res;
	res=tex2D(SamplerFocus, IN.txcoord.xy).x;
	res.x=saturate(-res.x);
	res.y=saturate(res.y);
	res.w=0.0;
	return res;
}



//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//blur in single direction only
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
float4	PS_BlurFocusNearHV(VS_OUTPUT_POST IN, float2 vPos : VPOS, uniform const float2 blurdir) : COLOR
{
	const	int		i_linesamplescount=4; //actually x2 in this shader. increase this value if blurring range of near plane increased
	const	float	f_linesamplescount=((float)i_linesamplescount);
	const	float	finv_linesamplescount=1.0/f_linesamplescount;
	const	float	finv_linesamplescountmultwo=1.0/(2.0 * f_linesamplescount);

	float2	scaling=blurdir;

	float2	pixelsize=ScreenSize.y;
	pixelsize.y*=ScreenSize.z;
	scaling*=pixelsize;

	float4	res=0.0;
	float4	coord1=0.0;
	float4	coord2=0.0;
	float2	uvsrc=IN.txcoord.xy;

	float4	centerfocus=tex2D(SamplerColor, uvsrc);

	float4	color;
	color.zw=0.5;
	color.xy=centerfocus.xy*color.zw;

	float2	pos=1.5;
	for (int i=0; i<i_linesamplescount; i++)
	{
		float4	tempcolor1;
		float4	tempcolor2;
		float4	tempfocus1;
		float4	tempfocus2;

		coord1.xy=pos * scaling + uvsrc;
		//coord2.xy=-pos * scaling + uvsrc; //compiler bug
		coord2.xy=pos * -scaling + uvsrc;

		tempfocus1=tex2Dlod(SamplerColor, coord1);
		tempfocus2=tex2Dlod(SamplerColor, coord2);

		color.xy+=tempfocus1.xy;
		color.xy+=tempfocus2.xy;

		pos.xy+=2.0;
	}

	color.xy=color.xy * finv_linesamplescountmultwo;
	res.xyz=color;

	res.w=1.0;

	return res;
}


//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
float4	PS_WriteUnblurred(VS_OUTPUT_POST IN, float2 vPos : VPOS) : COLOR
{
	float4	res;
	res=tex2D(SamplerOriginal, IN.txcoord.xy);
	return res;
}



//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//blur far distance separately
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
float4	PS_FarBlur(VS_OUTPUT_POST IN, float2 vPos : VPOS) : COLOR
{
	const	int		i_linesamplescount=4;
	const	float	f_linesamplescount=((float)i_linesamplescount);
	const	float	finv_linesamplescount=1.0/f_linesamplescount;
	const	float	finv_halflinesamplescountplusepsilon=1.0/(0.5 * f_linesamplescount + 0.2);
	const	float	f_halflinesamplescountminushalf=f_linesamplescount*0.5-0.5;

	float	centerfocus=tex2D(SamplerFocus, IN.txcoord.xy).x;
	clip(centerfocus - 0.035); //skip non far areas

	//float2	scaling=1.0;
	float2	scaling=2.0; //bigger range at cost of artifacts, which are filtered by PS_Blur shader

	float2	pixelsize=ScreenSize.y;
	pixelsize.y*=ScreenSize.z;
	scaling*=pixelsize;

	float4	res=0.0;
	float4	coord=0.0;
	float2	uvsrc=IN.txcoord.xy;

	float4	centercolor=tex2D(SamplerOriginal, IN.txcoord.xy);

	float	samplingrangefact=saturate(centerfocus);
	scaling*=samplingrangefact;//*samplingrangefact;

	float4	colorfar;
	colorfar.w=0.0001;
	colorfar.xyz=centercolor*colorfar.w;

	float2	pos=-f_halflinesamplescountminushalf;
	for (int y=0; y<i_linesamplescount; y++)
	{
		pos.x=-f_halflinesamplescountminushalf;
		for (int x=0; x<i_linesamplescount; x++)
		{
			float	range;
			float2	temppos=pos * finv_halflinesamplescountplusepsilon;
			range=saturate(dot(temppos.xy, temppos.xy));

			float4	tempcolor;
			float	tempweight;
			float	tempdepth;
			float	diff;
			float	far;

			coord.xy=pos.xy * scaling + uvsrc.xy;

			tempcolor=tex2Dlod(SamplerOriginal, coord);
			tempcolor.w=tex2Dlod(SamplerFocus, coord).x;

			//far blur computation
			far=saturate(3.0 - range*3.0); //sharp bokeh
			//far=(1.0 - range); //smooth bokeh
			far=saturate(far * centerfocus);
			far*=saturate(tempcolor.w); //mask

			far*=range+0.2; //artistic circle

			colorfar.xyz+=tempcolor * far;
			colorfar.w+=far;

			pos.x+=1.0;
		}
		pos.y+=1.0;
	}

	colorfar.xyz=colorfar / colorfar.w;

	res.xyz=colorfar;

	res.w=1.0;
	return res;
}


//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
float4	PS_WriteBlurToAlpha(VS_OUTPUT_POST IN, float2 vPos : VPOS) : COLOR
{
	float4	res;
	res=tex2D(SamplerColor, IN.txcoord.xy).x;
	return res;
}



//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
float4	PS_WriteFarBlur(VS_OUTPUT_POST IN, float2 vPos : VPOS) : COLOR
{
	float4	res;
	res=tex2D(SamplerColor, IN.txcoord.xy);
	return res;
}



//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//blur near distance separately
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
float4	PS_NearBlur(VS_OUTPUT_POST IN, float2 vPos : VPOS) : COLOR
{
	const	int		i_linesamplescount=6;
	const	float	f_linesamplescount=((float)i_linesamplescount);
	const	float	finv_linesamplescount=1.0/f_linesamplescount;
	const	float	finv_halflinesamplescountplusepsilon=1.0/(0.5 * f_linesamplescount + 0.2);
	const	float	f_halflinesamplescountminushalf=f_linesamplescount*0.5-0.5;

	float	blurrednear=tex2D(SamplerColor, IN.txcoord.xy).w;
	clip(blurrednear - 0.035); //skip non near areas

	//float2	scaling=1.0;
	float2	scaling=2.0; //bigger range at cost of artifacts, which are filtered by PS_Blur shader

	float2	pixelsize=ScreenSize.y;
	pixelsize.y*=ScreenSize.z;
	scaling*=pixelsize;

	float4	res=0.0;
	float4	coord=0.0;
	float2	uvsrc=IN.txcoord.xy;

	float4	centercolor=tex2D(SamplerColor, IN.txcoord.xy);
	float	centerfocus=tex2D(SamplerFocus, IN.txcoord.xy).x;

	float	samplingrangefact=saturate(blurrednear * 3.3);
	scaling*=samplingrangefact; // * samplingrangefact

	float4	colornear=0.0;

	float2	pos=-f_halflinesamplescountminushalf;
	for (int y=0; y<i_linesamplescount; y++)
	{
		pos.x=-f_halflinesamplescountminushalf;
		for (int x=0; x<i_linesamplescount; x++)
		{
			float	range;
			float2	temppos=pos * finv_halflinesamplescountplusepsilon;
			range=saturate(dot(temppos.xy, temppos.xy));

			float4	tempcolor;
			float	tempweight;
			float	tempdepth;
			float	diff;
			float	near;

			coord.xy=pos.xy * scaling + uvsrc.xy;

			tempcolor=tex2Dlod(SamplerColor, coord);
			tempcolor.w=tex2Dlod(SamplerFocus, coord).x;

			//near blur computation
			near=(1.0 - range);

			diff=saturate(-tempcolor.w);

			near*=diff;

			colornear.xyz+=tempcolor * near;
			colornear.w+=near;

			pos.x+=1.0;
		}
		pos.y+=1.0;
	}

	centercolor.w=1.0;
	colornear.xyz+=centercolor*centercolor.w;
	colornear.w+=centercolor.w;

	colornear.xyz=colornear / colornear.w;

	res.xyz=colornear;

	res.w=abs(centerfocus);
	return res;
}



//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//extra small blur for fixing artifacts, not much required
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
float4	PS_Blur(VS_OUTPUT_POST IN, float2 vPos : VPOS) : COLOR
{
	float2	scaling=1.5;

	float2	pixelsize=ScreenSize.y;
	pixelsize.y*=ScreenSize.z;
	scaling*=pixelsize;

	float4	res=0.0;
	float4	coord=0.0;
	float2	uvsrc=IN.txcoord.xy;

	float4	centercolor=tex2D(SamplerColor, uvsrc);
	float	centerfocus=tex2D(SamplerFocus, uvsrc).x;
	float4	color=centercolor;

	scaling*=abs(centerfocus); //disable extra blurring in focused area

	float2	offsets[4]=
	{
		float2(-0.683, 0.183),
		float2( 0.183, 0.683),
		float2( 0.683,-0.183),
		float2(-0.183,-0.683)
	};

	for (int i=0; i<4; i++)
	{
		coord.xy=offsets[i].xy * scaling + uvsrc.xy;
		float4	tempcolor=tex2D(SamplerColor, coord);
		color+=tempcolor;
	}
	color*=0.2;	

	res=color;
	return res;
}



//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
technique PostProcess
{
	pass p0
	{
		VertexShader = compile vs_3_0 VS_PostProcess();
		PixelShader  = compile ps_3_0 PS_ZeroAlpha();

		ZEnable=FALSE;
		CullMode=NONE;
		ALPHATESTENABLE=FALSE;
		SEPARATEALPHABLENDENABLE=FALSE;
		AlphaBlendEnable=FALSE;
		SRGBWRITEENABLE=FALSE;
	}
}

technique PostProcess2
{
	pass p0
	{
		VertexShader = compile vs_3_0 VS_PostProcess();
		PixelShader  = compile ps_3_0 PS_BlurFocusNearHV(float2(0.0, 1.0));

		ZEnable=FALSE;
		CullMode=NONE;
		ALPHATESTENABLE=FALSE;
		SEPARATEALPHABLENDENABLE=FALSE;
		AlphaBlendEnable=FALSE;
		SRGBWRITEENABLE=FALSE;
	}
}

technique PostProcess3
{
	pass p0
	{
		VertexShader = compile vs_3_0 VS_PostProcess();
		PixelShader  = compile ps_3_0 PS_BlurFocusNearHV(float2(1.0, 0.0));

		ZEnable=FALSE;
		CullMode=NONE;
		ALPHATESTENABLE=FALSE;
		SEPARATEALPHABLENDENABLE=FALSE;
		AlphaBlendEnable=FALSE;
		SRGBWRITEENABLE=FALSE;
	}
}

technique PostProcess4
{
	pass p0
	{
		VertexShader = compile vs_3_0 VS_PostProcess();
		PixelShader  = compile ps_3_0 PS_WriteUnblurred();

		ZEnable=FALSE;
		CullMode=NONE;
		ALPHATESTENABLE=FALSE;
		SEPARATEALPHABLENDENABLE=FALSE;
		AlphaBlendEnable=FALSE;
		SRGBWRITEENABLE=FALSE;
	}
	pass p1
	{
		VertexShader = compile vs_3_0 VS_PostProcess();
		PixelShader  = compile ps_3_0 PS_FarBlur();
	}
	pass p2
	{
		VertexShader = compile vs_3_0 VS_PostProcess();
		PixelShader  = compile ps_3_0 PS_WriteBlurToAlpha();

		ColorWriteEnable=ALPHA;
	}
}

technique PostProcess5
{
	pass p0
	{
		VertexShader = compile vs_3_0 VS_PostProcess();
		PixelShader  = compile ps_3_0 PS_WriteFarBlur();

		ColorWriteEnable=ALPHA|RED|GREEN|BLUE;
		ZEnable=FALSE;
		CullMode=NONE;
		ALPHATESTENABLE=FALSE;
		SEPARATEALPHABLENDENABLE=FALSE;
		AlphaBlendEnable=FALSE;
		SRGBWRITEENABLE=FALSE;
	}
	pass p1
	{
		VertexShader = compile vs_3_0 VS_PostProcess();
		PixelShader  = compile ps_3_0 PS_NearBlur();
	}
}

//not required, just an extra blur to eliminate artifacts of not pixel perfect sampling
technique PostProcess6
{
	pass p0
	{
		VertexShader = compile vs_3_0 VS_PostProcess();
		PixelShader  = compile ps_3_0 PS_Blur();

		ZEnable=FALSE;
		CullMode=NONE;
		ALPHATESTENABLE=FALSE;
		SEPARATEALPHABLENDENABLE=FALSE;
		AlphaBlendEnable=FALSE;
		SRGBWRITEENABLE=FALSE;
	}
}


