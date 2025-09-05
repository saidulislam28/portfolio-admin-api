export const SETTINGS = [
  {
    group: 'General',
    settings: [
      {
        key: 'email',
        label: 'Email',
        type: 'text',
        default: '',
      },
      {
        key: 'phone',
        label: 'Phone',
        type: 'text',
        default: '',
      },
      // {
      //     key: 'logo',
      //     label: 'Logo',
      //     type: 'image',
      //     default: ''
      // }
    ],
  },
  {
    group: 'Images',
    settings: [
      {
        key: 'logo',
        label: 'Logo',
        type: 'image',
        default: '',
      },
      {
        key: 'favicon',
        label: 'Favicon',
        type: 'image',
        default: '',
      },
    ],
  },
  {
    group: 'Social links',
    settings: [
      {
        key: 'facebook',
        label: 'Facebok',
        type: 'text',
        default: '',
      },
      {
        key: 'twitter',
        label: 'Twitter',
        type: 'text',
        default: '',
      },
      {
        key: 'instagram',
        label: 'Instagram',
        type: 'text',
        default: '',
      },
    ],
  },
  {
    group: 'Hero section',
    settings: [
      {
        key: 'hero_image',
        label: 'Hero image',
        type: 'image',
        default: '',
      },
      {
        key: 'hero_title',
        label: 'Hero title',
        type: 'text',
        default: '',
      },
      {
        key: 'hero_desc',
        label: 'Hero description',
        type: 'text',
        default: '',
        field: 'textarea',
      },
    ],
  },
];

export const getImageFieldsKeys = () => {
  const arr = [];
  SETTINGS.map((group) => {
    return group.settings.map((item) => {
      if (item.type === 'image') {
        arr.push(item.key);
      }
    });
  });
  return arr;
};
