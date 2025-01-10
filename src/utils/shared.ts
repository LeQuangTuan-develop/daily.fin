import * as process from 'process'

export function isProduction(): boolean {
  return process.env.ENV == 'production'
}

export function isLocal() {
  return !['production', 'staging'].includes(process.env.ENV + '')
}

export function getTextRawEditorJs(text, getTextFn = GET_TEXT_FUNCTIONS) {
  if(!text) return ''
  try {
    const json = JSON.parse(text)
    const blocks =  json.blocks.reduce((text, block) => {
      return getTextFn[block.type]
          ? text + ( text.length > 0 ? ' ' : '' ) + getTextFn[block.type](block)
          : text
    }, '')
    return blocks
  } catch {
    return ''
  }
}

export function getTextForBlock(contents) {
  if(!contents) return ''
  try {
    const content = contents
        .replace(
            /((&nbsp;)|(&ensp;)|(&emsp;)|(&#160;)|(&#xa0;)|( &thinsp;)|(<br\/>))/g,
            ' ',
        )
        .replace(/(<([^>]+)>)/g, ' ')
        .trim()
    return (content || '')
  } catch {
    return ''
  }
}

export const GET_TEXT_FUNCTIONS = {
  header(block) {
    const text = block.data.text
    return getTextForBlock(text)
  },
  paragraph(block) {
    const text = block.data.text
    return getTextForBlock(text)
  },
  table(block) {
    let text = ''
    const content = block.data.content
    for(let row = 0; row < content.length; row++) {
      const rowItem = content[row]
      for(let column = 0; column < rowItem.length; column++) {
        const textForBlock = getTextForBlock(rowItem[column])
        text += ' ' +textForBlock
      }
    }
    return text
  },
  list(block) {
    let text = ''
    const items = block.data.items
    for(let j = 0; j < items.length; j++) {
      const textForBlock = getTextForBlock(items[j])
      text += ' ' +textForBlock
    }
    return text
  },
}


