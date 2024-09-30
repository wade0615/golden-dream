const CrownIcon = ({ size = '24', color = '#000' }) => (
  <svg
    width={size}
    height={size}
    viewBox={`0 0 ${size} ${size}`}
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M24 9.6263C23.9466 9.79157 23.8549 9.93938 23.7338 10.0557C23.6126 10.1721 23.4659 10.2532 23.3076 10.2912C23.0995 10.3363 22.8832 10.2942 22.7028 10.1734C22.5224 10.0526 22.3914 9.86225 22.3364 9.64098C22.2814 9.41971 22.3065 9.18414 22.4067 8.98215C22.5068 8.78015 22.6745 8.62689 22.8756 8.55351C23.0754 8.47593 23.295 8.48302 23.4902 8.57335C23.6853 8.66368 23.8414 8.83053 23.927 9.04021C23.9524 9.09848 23.9778 9.16017 24 9.22187V9.6263Z'
      fill={color}
    />
    <path
      d='M24 9.6263C23.9466 9.79157 23.8549 9.93938 23.7338 10.0557C23.6126 10.1721 23.4659 10.2532 23.3076 10.2912C23.0995 10.3363 22.8832 10.2942 22.7028 10.1734C22.5224 10.0526 22.3914 9.86225 22.3364 9.64098C22.2814 9.41971 22.3065 9.18414 22.4067 8.98215C22.5068 8.78015 22.6745 8.62689 22.8756 8.55351C23.0754 8.47593 23.295 8.48302 23.4902 8.57335C23.6853 8.66368 23.8414 8.83053 23.927 9.04021C23.9524 9.09848 23.9778 9.16017 24 9.22187V9.6263Z'
      fill='white'
      fillOpacity='0.37'
    />
    <path
      d='M11.5399 21.9956C9.7979 21.9996 8.06005 21.8124 6.35317 21.4369C5.79242 21.3279 5.25446 21.1108 4.76508 20.796C4.56184 20.6764 4.39622 20.4941 4.28931 20.2726C4.1824 20.051 4.13904 19.8001 4.16478 19.5518C4.34297 17.1908 3.88174 14.8249 2.83714 12.7415C2.58622 12.2308 2.26226 11.7647 1.97322 11.278C1.91754 11.1965 1.86763 11.1105 1.82393 11.0209C1.77348 10.9246 1.75451 10.8127 1.77006 10.7033C1.78561 10.5939 1.83479 10.4933 1.9097 10.4177C1.97832 10.3347 2.07123 10.2795 2.17294 10.2615C2.27465 10.2434 2.37903 10.2634 2.46871 10.3183C2.57831 10.3837 2.68436 10.4558 2.78633 10.5342C3.67883 11.1306 4.56499 11.7372 5.4702 12.3131C5.69046 12.4367 5.9273 12.5222 6.17213 12.5667C6.48974 12.6489 6.65491 12.5667 6.68984 12.1862C6.74538 11.6776 6.75176 11.1642 6.7089 10.6542C6.62314 9.82131 6.47069 8.9953 6.33729 8.16928C6.25789 7.67916 6.49929 7.31928 6.88043 7.41867C7.04617 7.48356 7.18852 7.60358 7.28697 7.76142C7.75069 8.4092 8.16996 9.08784 8.64638 9.71849C8.94114 10.0967 9.27106 10.4412 9.63099 10.7467C10.0026 11.0895 10.244 11.0003 10.479 10.5514C10.8371 9.78501 11.0897 8.96636 11.2286 8.1213C11.3493 7.5592 11.4446 6.98682 11.5462 6.40758C11.6129 6.06483 11.7908 5.8729 12.0417 5.87633C12.2926 5.87975 12.4578 6.07855 12.534 6.42472C12.7627 7.50436 12.9882 8.58743 13.2423 9.66022C13.331 9.97288 13.4536 10.2731 13.6076 10.5548C13.8267 10.9866 14.0681 11.0586 14.4239 10.757C14.7726 10.47 15.0921 10.1437 15.3767 9.78361C15.8563 9.15296 16.2883 8.48461 16.7393 7.82997C16.7869 7.76142 16.825 7.68944 16.8759 7.62432C16.9397 7.52215 17.0346 7.44713 17.1441 7.41211C17.2536 7.37709 17.371 7.38426 17.4762 7.43238C17.5851 7.4824 17.674 7.57262 17.727 7.68691C17.7799 7.8012 17.7935 7.9321 17.7652 8.05618C17.6731 8.60114 17.5587 9.14268 17.4889 9.69107C17.4126 10.2909 17.3586 10.8941 17.3269 11.4973C17.3218 11.7577 17.3517 12.0174 17.4158 12.2685C17.4793 12.5564 17.6096 12.6112 17.8859 12.5701C18.4878 12.4239 19.0567 12.1502 19.5597 11.7647C20.195 11.3397 20.8048 10.8735 21.4305 10.4314C21.5442 10.3452 21.6745 10.2878 21.8116 10.2634C21.8936 10.2564 21.9758 10.2726 22.0501 10.3105C22.1245 10.3484 22.1883 10.4067 22.2352 10.4795C22.2821 10.5524 22.3105 10.6372 22.3176 10.7256C22.3246 10.814 22.3101 10.9028 22.2754 10.9832C22.2081 11.1256 22.1272 11.26 22.034 11.3842C20.4913 13.6884 19.737 16.4987 19.8996 19.3359C19.9345 20.2544 19.7249 20.6417 18.9467 21.0153C18.151 21.3582 17.3152 21.5809 16.463 21.6768C14.8317 21.9169 13.186 22.0235 11.5399 21.9956ZM6.06733 19.706C8.11279 20.7 16.3772 20.6897 18.0225 19.706C14.0827 18.7893 10.0071 18.7893 6.06733 19.706Z'
      fill={color}
    />
    <path
      d='M11.5399 21.9956C9.7979 21.9996 8.06005 21.8124 6.35317 21.4369C5.79242 21.3279 5.25446 21.1108 4.76508 20.796C4.56184 20.6764 4.39622 20.4941 4.28931 20.2726C4.1824 20.051 4.13904 19.8001 4.16478 19.5518C4.34297 17.1908 3.88174 14.8249 2.83714 12.7415C2.58622 12.2308 2.26226 11.7647 1.97322 11.278C1.91754 11.1965 1.86763 11.1105 1.82393 11.0209C1.77348 10.9246 1.75451 10.8127 1.77006 10.7033C1.78561 10.5939 1.83479 10.4933 1.9097 10.4177C1.97832 10.3347 2.07123 10.2795 2.17294 10.2615C2.27465 10.2434 2.37903 10.2634 2.46871 10.3183C2.57831 10.3837 2.68436 10.4558 2.78633 10.5342C3.67883 11.1306 4.56499 11.7372 5.4702 12.3131C5.69046 12.4367 5.9273 12.5222 6.17213 12.5667C6.48974 12.6489 6.65491 12.5667 6.68984 12.1862C6.74538 11.6776 6.75176 11.1642 6.7089 10.6542C6.62314 9.82131 6.47069 8.9953 6.33729 8.16928C6.25789 7.67916 6.49929 7.31928 6.88043 7.41867C7.04617 7.48356 7.18852 7.60358 7.28697 7.76142C7.75069 8.4092 8.16996 9.08784 8.64638 9.71849C8.94114 10.0967 9.27106 10.4412 9.63099 10.7467C10.0026 11.0895 10.244 11.0003 10.479 10.5514C10.8371 9.78501 11.0897 8.96636 11.2286 8.1213C11.3493 7.5592 11.4446 6.98682 11.5462 6.40758C11.6129 6.06483 11.7908 5.8729 12.0417 5.87633C12.2926 5.87975 12.4578 6.07855 12.534 6.42472C12.7627 7.50436 12.9882 8.58743 13.2423 9.66022C13.331 9.97288 13.4536 10.2731 13.6076 10.5548C13.8267 10.9866 14.0681 11.0586 14.4239 10.757C14.7726 10.47 15.0921 10.1437 15.3767 9.78361C15.8563 9.15296 16.2883 8.48461 16.7393 7.82997C16.7869 7.76142 16.825 7.68944 16.8759 7.62432C16.9397 7.52215 17.0346 7.44713 17.1441 7.41211C17.2536 7.37709 17.371 7.38426 17.4762 7.43238C17.5851 7.4824 17.674 7.57262 17.727 7.68691C17.7799 7.8012 17.7935 7.9321 17.7652 8.05618C17.6731 8.60114 17.5587 9.14268 17.4889 9.69107C17.4126 10.2909 17.3586 10.8941 17.3269 11.4973C17.3218 11.7577 17.3517 12.0174 17.4158 12.2685C17.4793 12.5564 17.6096 12.6112 17.8859 12.5701C18.4878 12.4239 19.0567 12.1502 19.5597 11.7647C20.195 11.3397 20.8048 10.8735 21.4305 10.4314C21.5442 10.3452 21.6745 10.2878 21.8116 10.2634C21.8936 10.2564 21.9758 10.2726 22.0501 10.3105C22.1245 10.3484 22.1883 10.4067 22.2352 10.4795C22.2821 10.5524 22.3105 10.6372 22.3176 10.7256C22.3246 10.814 22.3101 10.9028 22.2754 10.9832C22.2081 11.1256 22.1272 11.26 22.034 11.3842C20.4913 13.6884 19.737 16.4987 19.8996 19.3359C19.9345 20.2544 19.7249 20.6417 18.9467 21.0153C18.151 21.3582 17.3152 21.5809 16.463 21.6768C14.8317 21.9169 13.186 22.0235 11.5399 21.9956ZM6.06733 19.706C8.11279 20.7 16.3772 20.6897 18.0225 19.706C14.0827 18.7893 10.0071 18.7893 6.06733 19.706Z'
      fill='white'
      fillOpacity='0.37'
    />
    <path
      d='M12.0513 2.00009C12.2464 2.00054 12.4394 2.0425 12.6194 2.12357C12.7994 2.20464 12.9628 2.32322 13.1003 2.47253C13.2378 2.62185 13.3467 2.79895 13.4206 2.99372C13.4946 3.18848 13.5322 3.39707 13.5314 3.60756C13.5327 3.92786 13.4456 4.24131 13.2812 4.50805C13.1169 4.77478 12.8828 4.98274 12.6086 5.10546C12.3344 5.22818 12.0326 5.26011 11.7416 5.1972C11.4506 5.13429 11.1834 4.97937 10.9742 4.75215C10.765 4.52494 10.6232 4.23571 10.5667 3.92125C10.5103 3.60679 10.5418 3.28132 10.6573 2.98626C10.7728 2.69119 10.967 2.43987 11.2152 2.26426C11.4635 2.08865 11.7545 1.99669 12.0513 2.00009Z'
      fill={color}
    />
    <path
      d='M12.0513 2.00009C12.2464 2.00054 12.4394 2.0425 12.6194 2.12357C12.7994 2.20464 12.9628 2.32322 13.1003 2.47253C13.2378 2.62185 13.3467 2.79895 13.4206 2.99372C13.4946 3.18848 13.5322 3.39707 13.5314 3.60756C13.5327 3.92786 13.4456 4.24131 13.2812 4.50805C13.1169 4.77478 12.8828 4.98274 12.6086 5.10546C12.3344 5.22818 12.0326 5.26011 11.7416 5.1972C11.4506 5.13429 11.1834 4.97937 10.9742 4.75215C10.765 4.52494 10.6232 4.23571 10.5667 3.92125C10.5103 3.60679 10.5418 3.28132 10.6573 2.98626C10.7728 2.69119 10.967 2.43987 11.2152 2.26426C11.4635 2.08865 11.7545 1.99669 12.0513 2.00009Z'
      fill='white'
      fillOpacity='0.37'
    />
    <path
      d='M17.0219 5.56789C17.0202 5.39107 17.0511 5.21566 17.1129 5.05186C17.1746 4.88806 17.2659 4.73916 17.3815 4.6138C17.4971 4.48845 17.6346 4.38915 17.7861 4.3217C17.9375 4.25425 18.0999 4.21999 18.2638 4.2209C18.5827 4.2383 18.8833 4.38727 19.1033 4.637C19.3233 4.88674 19.446 5.21816 19.446 5.56275C19.446 5.90734 19.3233 6.23875 19.1033 6.48849C18.8833 6.73823 18.5827 6.88719 18.2638 6.90459C18.1007 6.9055 17.9391 6.87156 17.7883 6.80475C17.6375 6.73794 17.5003 6.63957 17.3849 6.51531C17.2695 6.39105 17.1779 6.24336 17.1156 6.08075C17.0533 5.91815 17.0215 5.74384 17.0219 5.56789Z'
      fill={color}
    />
    <path
      d='M17.0219 5.56789C17.0202 5.39107 17.0511 5.21566 17.1129 5.05186C17.1746 4.88806 17.2659 4.73916 17.3815 4.6138C17.4971 4.48845 17.6346 4.38915 17.7861 4.3217C17.9375 4.25425 18.0999 4.21999 18.2638 4.2209C18.5827 4.2383 18.8833 4.38727 19.1033 4.637C19.3233 4.88674 19.446 5.21816 19.446 5.56275C19.446 5.90734 19.3233 6.23875 19.1033 6.48849C18.8833 6.73823 18.5827 6.88719 18.2638 6.90459C18.1007 6.9055 17.9391 6.87156 17.7883 6.80475C17.6375 6.73794 17.5003 6.63957 17.3849 6.51531C17.2695 6.39105 17.1779 6.24336 17.1156 6.08075C17.0533 5.91815 17.0215 5.74384 17.0219 5.56789Z'
      fill='white'
      fillOpacity='0.37'
    />
    <path
      d='M5.70835 4.22101C5.95364 4.22039 6.19364 4.29797 6.39822 4.44402C6.6028 4.59006 6.76284 4.79806 6.85826 5.04191C6.95368 5.28575 6.98022 5.55458 6.93457 5.81465C6.88891 6.07472 6.77308 6.31445 6.60161 6.50373C6.43015 6.69302 6.2107 6.82343 5.9708 6.87861C5.73089 6.93378 5.48122 6.91126 5.25313 6.81387C5.02505 6.71647 4.82871 6.54854 4.68875 6.33116C4.5488 6.11378 4.47146 5.85663 4.46645 5.59199C4.46393 5.41379 4.49414 5.23681 4.5553 5.07127C4.61646 4.90572 4.70738 4.75487 4.82282 4.62743C4.93827 4.49998 5.07597 4.39845 5.22795 4.3287C5.37993 4.25895 5.5432 4.22235 5.70835 4.22101Z'
      fill={color}
    />
    <path
      d='M5.70835 4.22101C5.95364 4.22039 6.19364 4.29797 6.39822 4.44402C6.6028 4.59006 6.76284 4.79806 6.85826 5.04191C6.95368 5.28575 6.98022 5.55458 6.93457 5.81465C6.88891 6.07472 6.77308 6.31445 6.60161 6.50373C6.43015 6.69302 6.2107 6.82343 5.9708 6.87861C5.73089 6.93378 5.48122 6.91126 5.25313 6.81387C5.02505 6.71647 4.82871 6.54854 4.68875 6.33116C4.5488 6.11378 4.47146 5.85663 4.46645 5.59199C4.46393 5.41379 4.49414 5.23681 4.5553 5.07127C4.61646 4.90572 4.70738 4.75487 4.82282 4.62743C4.93827 4.49998 5.07597 4.39845 5.22795 4.3287C5.37993 4.25895 5.5432 4.22235 5.70835 4.22101Z'
      fill='white'
      fillOpacity='0.37'
    />
    <path
      d='M0.890083 8.5019C1.00433 8.4943 1.11881 8.51202 1.22647 8.55397C1.33412 8.59592 1.43268 8.66121 1.51607 8.74582C1.59946 8.83043 1.6659 8.93256 1.71133 9.04594C1.75675 9.15931 1.78018 9.28151 1.78018 9.40503C1.78018 9.52854 1.75675 9.65075 1.71133 9.76412C1.6659 9.87749 1.59946 9.97963 1.51607 10.0642C1.43268 10.1488 1.33412 10.2141 1.22647 10.2561C1.11881 10.298 1.00433 10.3158 0.890083 10.3082C0.77584 10.3158 0.661374 10.298 0.553719 10.2561C0.446063 10.2141 0.3475 10.1488 0.264113 10.0642C0.180726 9.97963 0.114282 9.87749 0.0688586 9.76412C0.0234347 9.65075 0 9.52854 0 9.40503C0 9.28151 0.0234347 9.15931 0.0688586 9.04594C0.114282 8.93256 0.180726 8.83043 0.264113 8.74582C0.3475 8.66121 0.446063 8.59592 0.553719 8.55397C0.661374 8.51202 0.77584 8.4943 0.890083 8.5019Z'
      fill={color}
    />
    <path
      d='M0.890083 8.5019C1.00433 8.4943 1.11881 8.51202 1.22647 8.55397C1.33412 8.59592 1.43268 8.66121 1.51607 8.74582C1.59946 8.83043 1.6659 8.93256 1.71133 9.04594C1.75675 9.15931 1.78018 9.28151 1.78018 9.40503C1.78018 9.52854 1.75675 9.65075 1.71133 9.76412C1.6659 9.87749 1.59946 9.97963 1.51607 10.0642C1.43268 10.1488 1.33412 10.2141 1.22647 10.2561C1.11881 10.298 1.00433 10.3158 0.890083 10.3082C0.77584 10.3158 0.661374 10.298 0.553719 10.2561C0.446063 10.2141 0.3475 10.1488 0.264113 10.0642C0.180726 9.97963 0.114282 9.87749 0.0688586 9.76412C0.0234347 9.65075 0 9.52854 0 9.40503C0 9.28151 0.0234347 9.15931 0.0688586 9.04594C0.114282 8.93256 0.180726 8.83043 0.264113 8.74582C0.3475 8.66121 0.446063 8.59592 0.553719 8.55397C0.661374 8.51202 0.77584 8.4943 0.890083 8.5019Z'
      fill='white'
      fillOpacity='0.37'
    />
  </svg>
);

export default CrownIcon;