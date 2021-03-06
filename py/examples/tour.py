import asyncio
import collections
import os
import os.path
import sys
from typing import List, Optional, Dict

from pygments import highlight
from pygments.formatters.html import HtmlFormatter
from pygments.lexers import get_lexer_by_name

from h2o_wave import main, app, Q, ui

py_lexer = get_lexer_by_name('python')
html_formatter = HtmlFormatter(full=True, style='xcode')
example_dir = os.path.dirname(os.path.realpath(__file__))

_app_host = '127.0.0.1'
_app_port = '10102'


class Example:
    def __init__(self, filename: str, title: str, description: str, source: str):
        self.name = os.path.splitext(filename)[0]
        self.filename = filename
        self.title = title
        self.description = description
        self.source = source
        self.code = highlight(source, py_lexer, html_formatter)
        self.previous_example: Optional[Example] = None
        self.next_example: Optional[Example] = None
        self.process: Optional[asyncio.subprocess.Process] = None
        self.is_app = source.find('@app(') > 0

    async def start(self):
        if self.is_app:
            self.process = await asyncio.create_subprocess_exec(
                sys.executable, '-m', 'uvicorn', '--port', _app_port, f'examples.{self.name}:main', env=dict(
                    H2O_WAVE_EXTERNAL_ADDRESS=f'http://{_app_host}:{_app_port}'
                ),
            )
        else:
            self.process = await asyncio.create_subprocess_exec(
                sys.executable, os.path.join(example_dir, self.filename)
            )

    async def stop(self):
        if self.process and self.process.returncode is None:
            self.process.terminate()


active_example: Optional[Example] = None


def read_lines(p: str) -> List[str]:
    with open(p, encoding='utf-8') as f:
        return f.readlines()


def read_file(p: str) -> str:
    with open(p, encoding='utf-8') as f:
        return f.read()


def strip_comment(line: str) -> str:
    return line.strip(" #")


def load_example(filename: str) -> Example:
    contents = read_file(os.path.join(example_dir, filename))
    parts = contents.split('---', maxsplit=1)
    header, source = parts[0].strip().splitlines(), parts[1].strip()
    title, description = strip_comment(header[0]), [strip_comment(x) for x in header[1:]]
    return Example(filename, title, '\n'.join(description), source)


def load_examples(filenames: List[str]) -> Dict[str, Example]:
    examples = collections.OrderedDict()
    for filename in filenames:
        example = load_example(filename)
        examples[example.name] = example
    example_list = [e for e in examples.values()]
    k = len(example_list) - 1
    for i, e in enumerate(example_list):
        if i > 0:
            e.previous_example = example_list[i - 1]
        if i < k:
            e.next_example = example_list[i + 1]
    return examples


app_title = 'H2O Wave Tour'


async def setup_page(q: Q):
    q.page['meta'] = ui.meta_card(
        box='',
        title=app_title
    )

    q.page['header'] = ui.header_card(
        box='1 1 2 1',
        title=app_title,
        subtitle=f'{len(catalog)} Interactive Examples',
    )

    q.page['examples'] = ui.nav_card(
        box='1 2 2 -1',
        items=[
            ui.nav_group(
                label='Examples',
                items=[ui.nav_item(name=f'#{e.name}', label=e.title) for e in catalog.values()]
            ),
        ],
    )

    q.page['blurb'] = ui.form_card(
        box='3 1 5 3',
        items=[],
    )

    q.page['code'] = ui.frame_card(
        box='3 4 5 -1',
        title='',
        content='',
    )
    q.page['preview'] = ui.frame_card(
        box='8 1 5 -1',
        title='Preview',
        path='/demo',
    )
    await q.page.save()


def make_blurb(example: Example):
    buttons = []
    if example.previous_example:
        buttons.append(ui.button(name=f'#{example.previous_example.name}', label='Previous'))
    if example.next_example:
        buttons.append(ui.button(name=f'#{example.next_example.name}', label='Next', primary=True))

    return [
        ui.text(example.title, size='l'),
        ui.text(example.description),
        ui.buttons(buttons),
    ]


async def show_example(q: Q, example: Example):
    # Clear demo page
    demo_page = q.site['/demo']
    demo_page.drop()
    await demo_page.save()

    # Stop active example, if any.
    global active_example
    if active_example:
        await active_example.stop()

    # Start new example
    active_example = example
    await active_example.start()

    # Update example blurb
    q.page['blurb'].items = make_blurb(active_example)

    # Update code display
    code_card = q.page['code']
    code_card.title = active_example.filename
    code_card.content = active_example.code

    preview_card = q.page['preview']

    # Update preview title
    preview_card.title = f'Preview of {active_example.filename}'
    # HACK
    # The ?e= appended to the path forces the frame to reload.
    # The url param is not actually used.
    preview_card.path = f'/demo?e={active_example.name}'
    await q.page.save()


@app('/tour')
async def serve(q: Q):
    if not q.client.initialized:
        q.client.initialized = True
        await setup_page(q)

    route = q.args['#']
    if not route:
        route = 'hello_world'

    await show_example(q, catalog[route])


example_filenames = [line.strip() for line in read_lines(os.path.join(example_dir, 'tour.conf')) if
                     not line.strip().startswith('#')]
catalog = load_examples(example_filenames)
print('----------------------------------------')
print(' Welcome to the H2O Wave Interactive Tour!')
print('')
print(' Go to http://localhost:10101/tour')
print('----------------------------------------')
