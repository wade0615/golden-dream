import { useCallback, useState, forwardRef } from 'react';
import classNames from 'classnames';
// import Swal from 'sweetalert2';

import { Editor as TinyEditor } from '@tinymce/tinymce-react';
import tinymce from 'tinymce/tinymce';

import api from 'services/api';
import { useFormContext, useController } from 'react-hook-form';
import { TagChip } from 'components/chip';

import { zh_TW } from './zh_TW';
import './editorStyle.scss';

// Theme
import 'tinymce/themes/silver/index';
// Toolbar icons
import 'tinymce/icons/default/icons';

// Editor styles
import 'tinymce/skins/ui/oxide/skin.min.css';

// plugin
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/link';
import 'tinymce/plugins/image';
// import 'tinymce/plugins/media';
import 'tinymce/plugins/table';
import 'tinymce/plugins/fullscreen';
// import 'tinymce/plugins/line'

/* eslint import/no-webpack-loader-syntax: off */
// import contentCss from '!!raw-loader!tinymce/skins/content/default/content.min.css';
// import contentUiCss from '!!raw-loader!tinymce/skins/ui/oxide/content.min.css';

tinymce.addI18n('zh_TW', zh_TW);

// custom upload handler
const imagesUploadHandler = async (blobInfo, success, failure, progress) => {
  const formData = new FormData();
  formData.append('files', blobInfo.blob(), blobInfo.filename());
  formData.append('imageUploadType', 'editor');
  const res = await api.common.uploadImage(formData);
  if (res) {
    success(res.urls?.[0]);
    return;
  }
  failure('圖檔上傳失敗');
  return;
};

const _plugins = ' link lists advlist image  table fullscreen';

const toolbar = {
  text: `undo redo  formatselect fontsizeselect lineheight
  | forecolor backcolor removeformat 
    | bold italic underline strikethrough`,
  alignList: ` | alignleft aligncenter alignright alignjustify
    | outdent indent  numlist bullist `,
  other: `| insertfile image link table  | fullscreen
    `
};

// const fontFormats = `預設字體=Noto Sans TC;`;

const fontSize = `8px 10px 12px 14px 16px 18px 24px 36px 48px 60px 72px`;
const _lineHeight = `1 1.1 1.2 1.3 1.4 1.5 1.6 1.7 1.8 1.9 2 2.1 2.2 2.3 2.4 2.5 2.6 2.7 2.8 2.9 3`;

const imgInit = {
  images_upload_handler: imagesUploadHandler,
  image_title: true,
  file_picker_types: 'image'
};

/** 預設樣式，模擬前台 reset css 環境 & 統一會使用到的基礎樣式 (需和前台的 _$HtmlDom 相同)
 * @type css string
 */
const defaultCss = `
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@100;300;400;500;700;900&display=swap');

html{
  margin:0.5rem;
}

body, * {
  box-sizing: border-box;
  }

  html, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, em, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, menu, nav, output, ruby, section, summary, time, mark, audio, video, input {
    margin: 0;
    padding: 0;
    border: none;
    font: inherit;
    vertical-align: baseline;
  }
  
  
  article, aside, details, figcaption, figure, footer, header, hgroup, main, nav, section, summary {
    display: block;
  }
  
  audio, canvas, video {
    display: inline-block;
  }
  
  audio:not([controls]) {
    display: none;
    height: 0;
  }
  
  [hidden] {
    display: none;
  }
  
  a {
    text-decoration: none;
  }
  
  abbr[title] {
    border-bottom: 1px dotted;
  }
  
  b, strong {
    font-weight: bold;
  }
  
  dfn {
    font-style: italic;
  }
  
  hr {
    -moz-box-sizing: content-box;
    box-sizing: content-box;
    height: 0;
  }
  
  mark {
    background: #FFFF00;
    color: #000000;
  }
  
  code, kbd, pre, samp {
    font-family: monospace, serif;
    font-size: 1em;
  }
  
  pre {
    white-space: pre-wrap;
  }
  
  q {
    quotes: "\\201C" "\\201D" "\\2018" "\\2019";
  }
  
  small {
    font-size: 80%;
  }
  
  sub {
    font-size: 75%;
    line-height: 0;
    position: relative;
    vertical-align: baseline;
  }
  
  sup {
    font-size: 75%;
    line-height: 0;
    position: relative;
    vertical-align: baseline;
    top: -0.5em;
  }
  
  sub {
    bottom: -0.25em;
  }
  
  img {
    max-width: 100%;
    height: auto;
  }
  
  svg:not(:root) {
    overflow: hidden;
  }
  
  figure {
    margin: 0;
  }
  
  fieldset {
    border: 1px solid #C0C0C0;
    margin: 0 2px;
    padding: 0.35em 0.625em 0.75em;
  }
  
  legend {
    border: 0;
    padding: 0;
  }
  
  button, input, select, textarea {
    font-family: inherit;
    font-size: 100%;
    margin: 0;
  }
  
  button, input {
    line-height: normal;
  }
  
  button, select {
    text-transform: none;
  }
  
   button, html input[type="button"] {
    -webkit-appearance: button;
    padding: 2px 6px;
    cursor: pointer;
    outline: none;
  } 
  
   input {
      border:0;
    &[type="reset"], &[type="submit"] {
      -webkit-appearance: button;
      cursor: pointer;
    }
    &:focus-visible {
      outline: 0;
    }
  } 
  
  button[disabled], html input[disabled] {
    cursor: default;
  }

body{
  font-family: 'Noto Sans TC', sans-serif;
  font-size:16px;
  line-height:140%;
  font-weight:400;
  color:#141414;
}

p{
  font-size:16px;
  line-height:140%;
  font-weight:400;
}

h1{
  font-size:28px;
  line-height:180%;
  font-weight:bold;
}
h2{
  font-size:26px;
  line-height:160%;
  font-weight:bold;
}
h3{
  font-size:22px;
  line-height:160%;
  font-weight:bold;
}
h4{
  font-size:18px;
  line-height:135%;
  font-weight:bold;
}
h5{
  font-size:16px;
  line-height:160%;
  font-weight:bold;
}
h6{
  font-size:14px;
  line-height:160%;
  font-weight:bold;
}

a{
  cursor:pointer;
  color:inherit;
}

ul,ol{
all:revert;
}

em {
  all:revert;
}

tbody {
border:1px solid gray;
  display: table-row-group;
  vertical-align: middle;
  border-color: inherit;
}
tr {
border:inherit; 
  display: table-row;
  vertical-align: inherit;
  border-color: inherit;
}
td {
  border:inherit; 
  display: table-cell;
  vertical-align: inherit;
}
`;

/**
 * wysiwyg editor，!!注意!! 請勿監聽使用 watch，會使整個 editor re-render
 * @param {string} name 綁定 react hook form
 * @param {number} maxCount 字數最大值 default = 2000
 * @param {string} initContnet editor 初始值 <html string>
 * @param {ref} innerRef 要操作 method 的時候需綁定 editor Ref
 */
const Editor = forwardRef(
  (
    {
      maxCount = 2000,
      name = 'editor',
      initContent = '',
      height,
      disabled = false,
      required = false,
      handleEditorTextLength,
      options = [],
      noErrorMessage = false,
      ...props
    },
    editorRef
  ) => {
    const [wordCount, setWordCount] = useState(0);
    const { control, setError } = useFormContext();

    const {
      field: { onChange, ...field },
      fieldState: { error }
    } = useController({ control, name });

    const handleEditorInit = (e, editor) => {
      editorRef.current = editor; // 確保 ref 正確引用編輯器實例
      editor.setContent(initContent); // 設置初始內容
    };

    const handleEditorChange = useCallback((newText, editor) => {
      onChange(newText);
      const textContent = editor.getBody().textContent || ''; // 獲取純文本內容
      updateWordCount(textContent); // 更新字數計數器
      const body = editor.getBody();
      const numChars = body.textContent?.length ?? 0;
      if (handleEditorTextLength) {
        handleEditorTextLength(numChars);
      }
      // eslint-disable-next-line
    }, []);

    // const handleKeyDown = (e, editor) => {
    //   const body = editor.getBody();
    //   const numChars = body.textContent?.length ?? 0;
    //   //   if (numChars > maxCount) {
    //   //     setError(name, {
    //   //       type: 'custom',
    //   //       message: `字數已達上限 ${maxCount} 字`
    //   //     });
    //   //   } else {
    //   //     setError(name, '');
    //   //   }
    //   //   if (numChars >= maxCount) {
    //   //     Swal.fire({
    //   //       icon: 'info',
    //   //       text: `字數已達上限 ${maxCount} 字`
    //   //     });
    //   //     return false;
    //   //   }
    // };

    const updateWordCount = (content) => {
      const numChars = content.length; // 或者其他計算字數的方式
      setWordCount(numChars);
      if (numChars > maxCount) {
        setError(name, {
          type: 'custom',
          message: `字數最多 ${maxCount} 個字`
        });
      } else {
        setError(name, '');
      }
    };

    const handleChipClick = (chipValue) => {
      const editor = editorRef.current;
      if (editor) {
        const content = editor.getContent({ format: 'text' }); // 獲取純文本內容
        const selection = editor.selection.getRng(true);
        const startOffset = selection.startOffset;
        const endOffset = selection.endOffset;
        const beforeText = content.substring(0, startOffset);
        const afterText = content.substring(endOffset);
        const insertionText = `{=${chipValue}=}`;
        const potentialNewContent = beforeText + insertionText + afterText;
        // if (potentialNewContent.length <= maxCount) {
        editor.selection.setContent(insertionText, { format: 'text' }); // 插入純文本
        updateWordCount(potentialNewContent); // 更新字數計數器
        // } else {
        //   // 處理超過字數限制的情況
        //   console.error('無法插入，因為超出了最大字數限制！');
        // }
      }
    };

    return (
      <div className='date-chip' style={{ position: 'relative' }}>
        {!!options && options.length > 0 && (
          <div className='chips pb-2'>
            {options.map((chip, idx) => (
              <TagChip
                key={idx}
                id={chip.value}
                label={chip.label}
                bgColor='var(--bs-primary)'
                rounded
                outline
                clickable={!disabled}
                onChipClick={() => handleChipClick(chip.value)}
              />
            ))}
          </div>
        )}
        <div className='editor-wrapper'>
          <TinyEditor
            name={name}
            {...field}
            ref={editorRef}
            onInit={handleEditorInit}
            // initialValue={initContent ?? ''}
            onEditorChange={handleEditorChange}
            // onKeyDown={handleKeyDown}
            // onPaste={handleKeyDown}
            init={{
              content_style: defaultCss,
              menubar: false,
              language: 'zh_TW',
              plugins: _plugins,
              toolbar: `${toolbar.text}${toolbar.alignList}${toolbar.other}`,
              fontsize_formats: fontSize,
              lineheight_formats: _lineHeight,
              block_formats:
                'Paragraph=p; 標題 1=h1; 標題 2=h2; 標題 3=h3;  標題 4=h4;  標題 5=h5; 標題 6=h6;',
              ...imgInit
            }}
            disabled={disabled}
          />
          <div
            className={classNames({
              'word-count': true,
              isError: wordCount > maxCount
            })}
          >
            {wordCount}/{maxCount}
          </div>
        </div>
        {!noErrorMessage && (
          <p className='editor-wrapper--error'>{error?.message}</p>
        )}
      </div>
    );
  }
);
export default Editor;
