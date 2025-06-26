import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PostList from './PostList';
import { BrowserRouter } from 'react-router-dom';

// Mock api
jest.mock('services/api', () => ({
  posts: {
    getPostList: jest.fn()
  }
}));

// Mock getPostsClass
jest.mock('./getPostsClass', () => {
  return {
    GetPostsClass: function (data) {
      return data;
    }
  };
});

const mockPosts = [
  {
    id: 1,
    title: 'Test Post 1',
    date: '2025-06-26',
    category: 'Tech',
    content: 'Content 1'
  },
  {
    id: 2,
    title: 'Test Post 2',
    date: '2025-06-25',
    category: 'Life',
    content: 'Content 2'
  }
];

const mockMeta = {
  page: 1,
  perPage: 10,
  totalCount: 2,
  totalPages: 1
};

describe('PostList', () => {
  beforeEach(() => {
    require('services/api').posts.getPostList.mockResolvedValue({
      metaData: mockMeta,
      postList: mockPosts
    });
  });

  it('renders post list and pagination info', async () => {
    render(
      <BrowserRouter>
        <PostList />
      </BrowserRouter>
    );

    // 等待文章渲染
    expect(await screen.findByText('Test Post 1')).toBeInTheDocument();
    expect(screen.getByText('Test Post 2')).toBeInTheDocument();
    expect(screen.getByText('共 2 筆，共 1 頁')).toBeInTheDocument();
  });

  it('disables previous button on first page', async () => {
    render(
      <BrowserRouter>
        <PostList />
      </BrowserRouter>
    );
    await waitFor(() => screen.getByText('Test Post 1'));
    expect(screen.getByText('上一頁')).toBeDisabled();
  });

  it('disables next button on last page', async () => {
    render(
      <BrowserRouter>
        <PostList />
      </BrowserRouter>
    );
    await waitFor(() => screen.getByText('Test Post 1'));
    expect(screen.getByText('下一頁')).toBeDisabled();
  });

  it('calls handlePostDetail when post is clicked', async () => {
    const { container } = render(
      <BrowserRouter>
        <PostList />
      </BrowserRouter>
    );
    await waitFor(() => screen.getByText('Test Post 1'));
    const postItem = container.querySelector('.posts_item');
    expect(postItem).toBeInTheDocument();
    fireEvent.click(postItem);
    // 由於 useNavigate 是 react-router-dom 的 hook，這裡可進一步 mock useNavigate 來驗證導頁
  });
});