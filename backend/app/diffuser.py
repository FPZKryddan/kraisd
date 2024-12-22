import torch
import io
import os
import base64
from diffusers import StableDiffusionPipeline, StableDiffusionXLPipeline
from DeepCache import DeepCacheSDHelper

device = 'cuda' if torch.cuda.is_available() else 'cpu'
# model = "D:\\School\\projekt\\Kraisd\\backend\\app\\models\\ponyRealism_v21MainVAE.safetensors"
# pipe = StableDiffusionXLPipeline.from_single_file(
#     model,
#     torch_dtype=torch.float16,
#     variant='fp16',
#     use_safetensors=True,
# )

pipe = StableDiffusionPipeline.from_pretrained(
    "Lykon/DreamShaper-8",
    torch_dtype=torch.float16,
    variant="fp16"
)
pipe = pipe.to(device).to(torch.float16)
pipe.enable_attention_slicing()
pipe.safety_checker = None

helper = DeepCacheSDHelper(pipe=pipe)
helper.set_params(cache_interval=3, cache_branch_id=0)
helper.enable()

# Generation settings
# width = 512
# height = 512
# batch_size = 1
# generation_steps = 25
# cfg = 7
# prompt = "masterpiece, best quality, fantasy medieval castle, hills, grassfield"


def generate_image(input, negPrompt, steps, cfg, seed, width, height, callback):
    genSeed = torch.Generator(device).manual_seed(int(seed))
    image = pipe(
        prompt=input,
        width=width,
        height=height,
        num_inference_steps=steps,
        guidance_scale=cfg,
        num_images_per_prompt=1,
        negative_prompt=negPrompt,
        added_cond_kwargs={},
        generator=genSeed,
        callback_on_step_end=callback
    ).images[0]
    buffer = io.BytesIO()
    image.save(buffer, format="JPEG")
    buffer.seek(0)
    img_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
    return img_base64


