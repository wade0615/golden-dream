import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import '@wcj/dark-mode';
import MarkdownEditor from '@uiw/react-markdown-editor';
import { useLocation } from 'react-router-dom';
// import localStorageUtil from 'utils/localStorageUtil';
// import LocalStorageKeys from 'constants/localStorageKeys';
import api from 'services/api';

import { IoMdList } from 'react-icons/io';
import { FaRegArrowAltCircleLeft } from 'react-icons/fa';
import { FaRegArrowAltCircleRight } from 'react-icons/fa';
import './postsPageStyle.scss';

import { GetPostByIdClass } from './getPostByIdClass';

import ExceptionHandleService from 'utils/exceptionHandler';

const _EHS = new ExceptionHandleService({
  _NAME: 'pages/posts/PostPage.js',
  _NOTICE: ''
});

/** 文章頁  */
const PostPage = () => {
  // const mdStr = `# H1\n## H2 \n## H3 \n## H4 \n## H5 \n## H6 \n\n**bold** \n*italic* \n~~strikethrough~~ \n\n[link](https://www.google.com) \n\n\`inline code\` \n\`\`\` \nblock code \n\`\`\` \n\n- list \n- list \n- list \n\n1. list \n2. list \n3. list \n\n> blockquote \n\n--- \n\n![image](https://www.google.com) \n\n| table | table | \n| ----- | ----- | \n| table | table | \n\n`;
  const mdStr = ``;

  const location = useLocation();
  const [markdown, setMarkdown] = useState(mdStr);
  const postId = useMemo(
    () => new URLSearchParams(location.search).get('id'),
    [location.search]
  );

  /** 取得指定文章 */
  const getPostById = useCallback(async (postId) => {
    try {
      if (!postId) {
        throw new Error('postId is required');
      }
      const apiReq = {
        postId: postId
      };
      const res = await api.posts.getPostById(apiReq);
      const apiRes = res;
      if (apiRes) {
        const res = new GetPostByIdClass(apiRes);
        return res;
      }
    } catch (error) {
      _EHS.errorReport(error, 'getPostById', _EHS._LEVEL.ERROR);
    }
  }, []);

  /** 上下頁按鈕動畫 */
  const btnAnimation = useCallback(() => {
    var $btn = document.getElementsByClassName('button');
    var mouseObj = {
      mouseCoords: null,
      mousetThreshold: 0.12,
      manageMouseLeave: function (event) {
        event.currentTarget.style.boxShadow = '0 0 0 rgba(0,0,0,0.2)';
        // update btn gradient
        event.currentTarget.style.background = '#233142';
      },
      manageMouseMove: function (event) {
        var eventDoc, doc, body;

        event = event || window.event; // IE-ism
        const target = event.currentTarget;
        // (old IE)
        if (event.pageX == null && event.clientX != null) {
          eventDoc = (event.target && event.target.ownerDocument) || document;
          doc = eventDoc.documentElement;
          body = eventDoc.body;

          event.pageX =
            event.clientX +
            ((doc && doc.scrollLeft) || (body && body.scrollLeft) || 0) -
            ((doc && doc.clientLeft) || (body && body.clientLeft) || 0);
          event.pageY =
            event.clientY +
            ((doc && doc.scrollTop) || (body && body.scrollTop) || 0) -
            ((doc && doc.clientTop) || (body && body.clientTop) || 0);
        }

        // Use event.pageX / event.pageY here

        //normalize
        //bodyRect = document.body.getBoundingClientRect(),
        var elemRect = target.getBoundingClientRect(), //$btn.getBoundingClientRect(),
          mean = Math.round(elemRect.width / 2);
        //offset   = elemRect.top - bodyRect.top;

        //mouseObj.mouseCoords = {mouse_x: event.pageX - elemRect.left , mouse_y:event.pageY - elemRect.top}
        mouseObj.mouseCoords = {
          mouse_true_x: event.pageX - elemRect.left,
          mouse_x:
            (event.pageX - elemRect.left - mean) * mouseObj.mousetThreshold,
          mouse_y: event.pageY - elemRect.top
        };
        mouseObj.manageButtonShadow(-1, target);
      },
      manageButtonShadow: function (direction, target) {
        if (mouseObj.mouseCoords) {
          mouseObj.mouseCoords.mouse_x = Math.floor(
            mouseObj.mouseCoords.mouse_x
          );
          target.style.boxShadow =
            direction * mouseObj.mouseCoords.mouse_x +
            'px 10px 0 rgba(0,0,0,0.2)';

          // update btn gradient
          target.style.background =
            'radial-gradient(at ' +
            mouseObj.mouseCoords.mouse_true_x +
            'px, #425265 0%, #233142 80%)';
        }
      }
    };

    // init listeners
    for (let i = 0; i < $btn.length; i++) {
      $btn[i].addEventListener('mousemove', mouseObj.manageMouseMove, false);
      $btn[i].addEventListener('mouseleave', mouseObj.manageMouseLeave, false);
    }
  }, []);

  /** 初次載入 */
  const getInit = useCallback(async () => {
    try {
      const postInfo = await getPostById(postId);
      const postContent = postInfo?.content;
      setMarkdown(postContent);

      btnAnimation();
    } catch (error) {
      _EHS.errorReport(error, 'getInit', _EHS._LEVEL.ERROR);
    }
  }, [getPostById, postId, btnAnimation]);

  /** 初始化 */
  useEffect(() => {
    getInit();
  }, [getInit]);

  return (
    <div id='post_page' className='post_container'>
      <dark-mode light='Light' dark='Dark'></dark-mode>

      <div className='post_editor' data-color-mode='light'>
        <MarkdownEditor.Markdown source={markdown} height='200px' />
      </div>

      <hr />

      <div className='button_container mb-3 justify-content-start'>
        <button class='px-4 button' id='button0'>
          <IoMdList />
          <span>Back to Post List</span>
        </button>
      </div>
      <div className='button_container justify-content-end'>
        <button class='px-4 button' id='button1'>
          <FaRegArrowAltCircleLeft />
          <span>Recent Post</span>
        </button>
        <button class='px-4 button' id='button2'>
          <span>Earlier Post</span>
          <FaRegArrowAltCircleRight />
        </button>
      </div>
    </div>
  );
};

export default PostPage;
