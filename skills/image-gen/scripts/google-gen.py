#!/usr/bin/env python3
"""
Google AI Studio Image Generator CLI

Usage:
    python google-gen.py "your prompt" [output.png] [model]

Models:
    - imagen-4 (default, high quality, $0.04/image)
    - imagen-4-fast (speed priority, $0.02/image)
    - gemini-2.5-flash-image (generation + editing)

Environment:
    GOOGLE_API_KEY=your-api-key
"""

import argparse
import os
import sys
from pathlib import Path

def main():
    parser = argparse.ArgumentParser(
        description='Generate images using Google AI Studio',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Models:
  imagen-4              High quality ($0.04/image)
  imagen-4-fast         Speed priority ($0.02/image)
  imagen-4-ultra        Maximum quality (2K, premium)
  gemini-2.5-flash-image   Generation + editing

Examples:
  python google-gen.py "a sunset over mountains"
  python google-gen.py "cyberpunk city" city.png
  python google-gen.py "portrait" art.png imagen-4-ultra

Get API key at: https://aistudio.google.com/apikey
        """
    )
    parser.add_argument('prompt', help='Text description of the image')
    parser.add_argument('output', nargs='?', default=None,
                        help='Output filename (default: image_timestamp.png)')
    parser.add_argument('model', nargs='?', default='imagen-4',
                        help='Model ID (default: imagen-4)')
    parser.add_argument('--aspect-ratio', '-ar', default='16:9',
                        choices=['1:1', '16:9', '9:16', '4:3', '3:4'],
                        help='Aspect ratio (default: 16:9)')
    parser.add_argument('--count', '-n', type=int, default=1,
                        help='Number of images (default: 1)')

    args = parser.parse_args()

    # Check API key
    api_key = os.environ.get('GOOGLE_API_KEY')
    if not api_key:
        print('Error: GOOGLE_API_KEY environment variable not set')
        print('Get your key at: https://aistudio.google.com/apikey')
        sys.exit(1)

    # Set default output
    if args.output is None:
        import time
        args.output = f'image_{int(time.time())}.png'

    try:
        import google.generativeai as genai
    except ImportError:
        print('Error: google-generativeai package not installed')
        print('Install with: pip install google-generativeai')
        sys.exit(1)

    # Configure
    genai.configure(api_key=api_key)

    print(f'\n🎨 Generating image...')
    print(f'   Prompt: "{args.prompt}"')
    print(f'   Model: {args.model}')
    print(f'   Output: {args.output}')
    print(f'   Aspect Ratio: {args.aspect_ratio}\n')

    try:
        if args.model.startswith('gemini'):
            # Use Gemini for image generation
            model = genai.GenerativeModel(args.model)
            response = model.generate_content(
                f"Generate an image: {args.prompt}"
            )

            # Extract image from response
            for part in response.parts:
                if hasattr(part, 'inline_data') and part.inline_data:
                    import base64
                    image_data = base64.b64decode(part.inline_data.data)
                    output_path = Path(args.output).resolve()
                    output_path.write_bytes(image_data)
                    print(f'\n✅ Saved: {output_path}')
                    print(f'   Size: {len(image_data) / 1024:.1f} KB')
                    return

            print('\n⚠️  No image in response. Text response:')
            print(response.text[:500] if response.text else '(empty)')

        else:
            # Use Imagen model
            model_name = f'{args.model}.0-generate' if not args.model.endswith('-generate') else args.model
            imagen = genai.ImageGenerationModel(model_name)

            result = imagen.generate_images(
                prompt=args.prompt,
                number_of_images=args.count,
                aspect_ratio=args.aspect_ratio
            )

            for i, image in enumerate(result.images):
                if args.count > 1:
                    output_name = f'{Path(args.output).stem}_{i+1}{Path(args.output).suffix}'
                else:
                    output_name = args.output

                output_path = Path(output_name).resolve()
                image.save(str(output_path))
                print(f'✅ Saved: {output_path}')

            if result.images:
                print(f'\n   Generated {len(result.images)} image(s)')

    except Exception as e:
        print(f'\n❌ Generation failed: {e}')
        sys.exit(1)


if __name__ == '__main__':
    main()
