    // 2. APPLICATION STATE & TRANSPARENT COLOR PALETTE ENGINE
    // =========================================================================
    let activePageId = 'demo-history'; // Mở trang History (Desktop / Tablet / Mobile từ Tablet)
    let currentViewMode = 'preview'; // 'preview' | 'tokens' | 'code' | 'ai-canvas'
    let codeOnlyFilter = false;
    let lastGeneratedAIHtml = '';
    let lastGeneratedAITitle = '';
    let lastGeneratedAIPrompt = '';
    let lastGeneratedAIBlocks = [];
    let lastGeneratedAIStandaloneMode = true;

    const COLORS_STORAGE_KEY = 'de_studio_transparent_colors_v1';

    const DEFAULT_COLOR_GROUPS = [
      {
        id: 'grey',
        category: 'neutral',
        name: 'Grey — Xám trung tính',
        desc: 'Nhóm màu trung tính bán trong suốt dùng cho văn bản, đường viền, lớp phủ tương tác (hover/active) và nền phụ. Tự động hòa trộn mượt mà trên mọi màu nền bề mặt.',
        calloutTitle: 'Thông tin về độ tương phản',
        calloutDesc: 'Các bậc 1000 & 700 đạt chuẩn tối thiểu WCAG AA (>= 4.5:1) cho văn bản; bậc 500 đạt >= 3:1 cho đường viền và icon chức năng.',
        rows: [
          {
            scale: '1000',
            purpose: 'Văn bản chính & Nút Tối (Text strong / Dark CTA)',
            purposeDesc: 'Tiêu đề, văn bản chính và nền mặc định cho Neutral Dark Button.',
            contrast: '>= 4.5:1',
            suggest: 'Phù hợp cho chữ thường, tiêu đề lớn và nút tương phản tối.',
            light: 'rgba(17, 24, 39, 0.94)',
            dark: 'rgba(248, 250, 252, 1)'
          },
          {
            scale: '900',
            purpose: 'Nền Hover Tối (Dark CTA Hover)',
            purposeDesc: 'Trạng thái di chuột (Hover) của Neutral Dark Button và văn bản nhấn.',
            contrast: '>= 4.5:1',
            suggest: 'Dùng cho trạng thái Hover và chữ cấp 2 (--ds-grey-900).',
            light: 'rgba(43, 48, 59, 1)',
            dark: 'rgba(203, 213, 225, 1)'
          },
          {
            scale: '800',
            purpose: 'Nền Focus Tối & Chữ phụ nổi (Dark CTA Focus)',
            purposeDesc: 'Trạng thái Focus/Pressed của Neutral Dark Button và chữ phụ Dark Mode.',
            contrast: '>= 4.5:1',
            suggest: 'Kết hợp cùng Focus Ring --ds-brand-ring hoặc chú thích trên nền tối.',
            light: 'rgba(60, 66, 78, 1)',
            dark: 'rgba(148, 163, 184, 1)'
          },
          {
            scale: '700',
            purpose: 'Văn bản phụ (Text weak)',
            purposeDesc: 'Mô tả bổ trợ, chú thích, nhãn phụ trong bảng và placeholder dễ đọc.',
            contrast: '>= 4.5:1',
            suggest: 'Dùng cho văn bản phụ nhưng vẫn đảm bảo chuẩn đọc WCAG AA (6.96:1 Dark).',
            light: 'rgba(17, 24, 39, 0.68)',
            dark: 'rgba(148, 163, 184, 1)'
          },
          {
            scale: '500',
            purpose: 'Viền đậm (Stroke strong)',
            purposeDesc: 'Đường viền ô nhập liệu khi tương tác, viền checkbox/radio và icon trang trí phụ.',
            contrast: '>= 3:1',
            suggest: 'Dùng cho đường viền control và thành phần đồ họa cần nhận diện rõ.',
            light: 'rgba(17, 24, 39, 0.44)',
            dark: 'rgba(100, 116, 139, 1)'
          },
          {
            scale: '300',
            purpose: 'Chữ & Icon Vô hiệu hóa (Disabled / Border Strong)',
            purposeDesc: 'Màu chữ vô hiệu hóa và viền nhấn cho trạng thái Disabled của Button, Input, Badge.',
            contrast: '< 3:1',
            suggest: 'Kết hợp trên nền Surface #0F172A cho thành phần Disabled.',
            light: 'rgba(17, 24, 39, 0.3)',
            dark: 'rgba(71, 85, 105, 1)'
          },
          {
            scale: '200',
            purpose: 'Viền tương tác & Active Dark Surface (Border Interactive)',
            purposeDesc: 'Viền bao quanh Badge xám nhạt, thẻ phụ, input border và bề mặt Active Dark Mode.',
            contrast: 'Surface / Border',
            suggest: 'Slate 700 (#334155) phân tách bề mặt tương tác trên Dark Surface.',
            light: 'rgba(17, 24, 39, 0.16)',
            dark: 'rgba(51, 65, 85, 1)'
          },
          {
            scale: '100',
            purpose: 'Viền mảnh & Hover Surface (Slate 800 Dark)',
            purposeDesc: 'Đường kẻ chia bảng dữ liệu, hover row và bề mặt phụ nổi cấp 2 ở Dark Mode.',
            contrast: 'Surface / Divider',
            suggest: 'Slate 800 (#1E293B) tạo phân tầng rõ nét không gây chói.',
            light: 'rgba(17, 24, 39, 0.12)',
            dark: 'rgba(30, 41, 59, 1)'
          },
          {
            scale: '50',
            purpose: 'Bề mặt Card Dark (#0F172A) & Nền nhấn nhẹ',
            purposeDesc: 'Nền Card Surface (#0F172A) trong Dark Mode hoặc hover/fill nhẹ ở Light Mode.',
            contrast: 'Surface Level 1',
            suggest: 'Slate 900 (#0F172A) làm nền thẻ chuẩn 12-Step Elevation.',
            light: 'rgba(17, 24, 39, 0.05)',
            dark: 'rgba(15, 23, 42, 1)'
          },
          {
            scale: '25',
            purpose: 'Nền Canvas Sâu Dark (#020617) & Nền phụ tinh tế',
            purposeDesc: 'Nền Canvas sâu nhất (#020617) ở Dark Mode hoặc vùng xen kẽ nhẹ ở Light Mode.',
            contrast: 'Canvas Level 0',
            suggest: 'Slate 950 (#020617) tạo độ sâu cho toàn bộ Workspace Dark Mode.',
            light: 'rgba(17, 24, 39, 0.025)',
            dark: 'rgba(2, 6, 23, 1)'
          }
        ]
      },
      {
        id: 'brand',
        category: 'brand',
        name: 'Brand — Màu Thương hiệu',
        desc: 'Màu nhận diện cốt lõi của sản phẩm SaaS, dùng nhất quán cho nút hành động chính (Primary CTA), liên kết (Text Link), mục đang được chọn và điểm nhấn điều hướng.',
        calloutTitle: 'Nguyên tắc dùng màu thương hiệu',
        calloutDesc: 'Chỉ dùng màu Brand cho hành động chính và trạng thái active để tránh loãng sự tập trung của người dùng.',
        rows: [
          {
            scale: '1200',
            purpose: 'Nền Focus Tối / Chữ nhấn Dark (Brand Focus)',
            purposeDesc: 'Màu xanh nhấn khi đạt Focus / Active trên nền sáng hoặc chữ trên nền Blue 950.',
            contrast: '>= 4.5:1',
            suggest: 'Dùng cho Primary Solid khi Focus hoặc chữ sáng --action-tinted-text Dark.',
            light: 'rgba(16, 42, 99, 1)',
            dark: 'rgba(191, 219, 254, 1)'
          },
          {
            scale: '1100',
            purpose: 'Nền Hover Đậm (Brand Hover Solid)',
            purposeDesc: 'Màu nền thương hiệu khi di chuột qua nút Primary CTA (--action-primary-hover).',
            contrast: '>= 4.5:1',
            suggest: 'Đảm bảo nút Primary giữ độ nổi rõ khi Hover (--ds-brand-1100).',
            light: 'rgba(36, 65, 224, 1)',
            dark: 'rgba(96, 165, 250, 1)'
          },
          {
            scale: '1000',
            purpose: 'Chữ & Nền chính (Text / Fill)',
            purposeDesc: 'Nền nút Primary, văn bản Text Link, icon trạng thái đang chọn và đường viền tab active.',
            contrast: '>= 4.5:1',
            suggest: 'Đảm bảo đủ tương phản cho chữ thương hiệu trên nền trắng/tối.',
            light: 'rgba(55, 88, 249, 1)',
            dark: 'rgba(129, 148, 255, 1)'
          },
          {
            scale: '800',
            purpose: 'Viền đậm & Hover (Stroke strong)',
            purposeDesc: 'Viền Secondary Button, biểu đồ dữ liệu và thanh tiến trình.',
            contrast: '>= 3:1',
            suggest: 'Dùng cho viền nút Outline và thành phần đồ họa.',
            light: 'rgba(55, 88, 249, 0.8)',
            dark: 'rgba(129, 148, 255, 0.85)'
          },
          {
            scale: 'ring',
            purpose: 'Vòng Focus (Focus Halo Ring)',
            purposeDesc: 'Vòng hào quang Focus bên ngoài (box-shadow spread 3.5px) cho Button và Form Input.',
            contrast: 'Không yêu cầu',
            suggest: 'Hỗ trợ chuẩn truy cập bàn phím Keyboard Focus Visible.',
            light: 'rgba(55, 88, 249, 0.28)',
            dark: 'rgba(59, 130, 246, 0.35)'
          },
          {
            scale: '200',
            purpose: 'Viền nhẹ (Stroke weak)',
            purposeDesc: 'Viền thẻ thông báo thương hiệu, viền card đang được chọn (selected state).',
            contrast: 'Không yêu cầu',
            suggest: 'Tạo khung bao quanh vùng nền Brand 50 / Blue 950.',
            light: 'rgba(55, 88, 249, 0.18)',
            dark: 'rgba(30, 64, 175, 0.65)'
          },
          {
            scale: '50',
            purpose: 'Nền thương hiệu nhạt (Fill / Dark Blue 950)',
            purposeDesc: 'Nền mục đang chọn trong sidebar, nền badge Beta/New và banner thông tin.',
            contrast: 'Không yêu cầu',
            suggest: 'Nền Tinted đặc #172554 ở Dark Mode giúp chữ sáng đạt tương phản cao.',
            light: 'rgba(55, 88, 249, 0.08)',
            dark: 'rgba(23, 37, 84, 1)'
          }
        ]
      },
      {
        id: 'red',
        category: 'system',
        name: 'Red — Đỏ (Lỗi & Nguy hiểm)',
        desc: 'Dùng để cảnh báo lỗi hệ thống, kiểm tra dữ liệu không hợp lệ (validation error) và các thao tác xóa/hủy mang tính phá hủy dữ liệu.',
        rows: [
          {
            scale: '1000',
            purpose: 'Chữ & Nền chính (Text / Fill)',
            purposeDesc: 'Thông báo lỗi, nút xóa (Danger button), chữ cảnh báo bắt buộc.',
            contrast: '>= 4.5:1',
            suggest: 'Dùng cho text báo lỗi trên nền trắng hoặc nền Red 50 / Dark 950 (#450A0A).',
            light: 'rgba(205, 43, 49, 1)',
            dark: 'rgba(248, 113, 113, 1)'
          },
          {
            scale: '800',
            purpose: 'Viền đậm (Stroke strong)',
            purposeDesc: 'Viền ô input khi nhập sai định dạng, biểu tượng cảnh báo lỗi.',
            contrast: '>= 3:1',
            suggest: 'Nhấn mạnh trạng thái lỗi của form control.',
            light: 'rgba(205, 43, 49, 0.78)',
            dark: 'rgba(239, 68, 68, 1)'
          },
          {
            scale: '200',
            purpose: 'Viền nhẹ (Stroke weak)',
            purposeDesc: 'Viền bao quanh hộp thông báo lỗi (Alert banner) hoặc badge nguy hiểm.',
            contrast: 'Không yêu cầu',
            suggest: 'Phân tách khung cảnh báo lỗi với nền xung quanh.',
            light: 'rgba(205, 43, 49, 0.18)',
            dark: 'rgba(127, 29, 29, 1)'
          },
          {
            scale: '50',
            purpose: 'Nền nhạt (Fill / Dark Red 950)',
            purposeDesc: 'Nền hộp Alert lỗi, nền badge trạng thái thất bại / quá hạn.',
            contrast: 'Không yêu cầu',
            suggest: 'Kết hợp cùng chữ Red 1000 trên nền #450A0A ở Dark Mode.',
            light: 'rgba(205, 43, 49, 0.08)',
            dark: 'rgba(69, 10, 10, 1)'
          }
        ]
      },
      {
        id: 'amber',
        category: 'system',
        name: 'Amber — Hổ phách (Cảnh báo & Chờ xử lý)',
        desc: 'Dùng cho các thông báo cần người dùng chú ý, trạng thái đang chờ duyệt (Pending), sắp hết hạn gói SaaS hoặc tính năng thử nghiệm.',
        rows: [
          {
            scale: '1000',
            purpose: 'Chữ & Nền chính (Text / Fill)',
            purposeDesc: 'Văn bản cảnh báo, icon chú ý và nhãn trạng thái Pending.',
            contrast: '>= 4.5:1',
            suggest: 'Tối ưu độ đậm để đọc rõ trên nền sáng lẫn Dark Amber 950 (#451A03).',
            light: 'rgba(146, 94, 15, 1)',
            dark: 'rgba(245, 158, 11, 1)'
          },
          {
            scale: '800',
            purpose: 'Viền đậm (Stroke strong)',
            purposeDesc: 'Viền nhấn cảnh báo, biểu tượng trạng thái đang chờ.',
            contrast: '>= 3:1',
            suggest: 'Dùng cho icon và viền trạng thái warning.',
            light: 'rgba(146, 94, 15, 0.78)',
            dark: 'rgba(251, 191, 36, 1)'
          },
          {
            scale: '200',
            purpose: 'Viền nhẹ (Stroke weak)',
            purposeDesc: 'Viền khung thông báo warning banner hoặc badge chờ duyệt.',
            contrast: 'Không yêu cầu',
            suggest: 'Kết hợp nhẹ với nền Amber 50 / Dark 950.',
            light: 'rgba(180, 120, 20, 0.2)',
            dark: 'rgba(120, 53, 15, 1)'
          },
          {
            scale: '50',
            purpose: 'Nền nhạt (Fill / Dark Amber 950)',
            purposeDesc: 'Nền thông báo nhắc nhở, nền tag Pending / Trial.',
            contrast: 'Không yêu cầu',
            suggest: 'Luôn đi kèm chữ Amber 1000 (#F59E0B trên #451A03 Dark).',
            light: 'rgba(180, 120, 20, 0.09)',
            dark: 'rgba(69, 26, 3, 1)'
          }
        ]
      },
      {
        id: 'green',
        category: 'system',
        name: 'Green — Xanh lá (Thành công & Hoạt động)',
        desc: 'Biểu thị thao tác hoàn tất, trạng thái hệ thống ổn định, tài khoản đang hoạt động (Active) hoặc thanh toán thành công.',
        rows: [
          {
            scale: '1000',
            purpose: 'Chữ & Nền chính (Text / Fill)',
            purposeDesc: 'Chữ thông báo thành công, badge Active, chỉ số tăng trưởng tích cực.',
            contrast: '>= 4.5:1',
            suggest: 'Đảm bảo đọc rõ trên nền trắng và nền Green 50 / Emerald 950 (#022C22).',
            light: 'rgba(14, 124, 77, 1)',
            dark: 'rgba(16, 185, 129, 1)'
          },
          {
            scale: '800',
            purpose: 'Viền đậm (Stroke strong)',
            purposeDesc: 'Viền ô input hợp lệ, icon tích xanh xác nhận.',
            contrast: '>= 3:1',
            suggest: 'Dùng cho icon trạng thái hoàn thành và đường chart tăng trưởng.',
            light: 'rgba(14, 124, 77, 0.78)',
            dark: 'rgba(52, 211, 153, 1)'
          },
          {
            scale: '200',
            purpose: 'Viền nhẹ (Stroke weak)',
            purposeDesc: 'Viền hộp thông báo thành công hoặc thẻ trạng thái Active.',
            contrast: 'Không yêu cầu',
            suggest: 'Đóng khung mềm mại cho thông báo tích cực.',
            light: 'rgba(14, 124, 77, 0.18)',
            dark: 'rgba(6, 95, 70, 1)'
          },
          {
            scale: '50',
            purpose: 'Nền nhạt (Fill / Dark Emerald 950)',
            purposeDesc: 'Nền Toast thành công, nền badge Active / Đã hoàn tất.',
            contrast: 'Không yêu cầu',
            suggest: 'Nền đặc #022C22 kết hợp chữ Emerald #10B981 ở Dark Mode.',
            light: 'rgba(14, 124, 77, 0.08)',
            dark: 'rgba(2, 44, 34, 1)'
          }
        ]
      },
      {
        id: 'teal',
        category: 'system',
        name: 'Teal — Xanh ngọc (Thông tin & Hỗ trợ)',
        desc: 'Dùng cho thông tin hướng dẫn trung tính, mẹo sử dụng (Tips), thẻ phân loại bổ sung và các nhãn thông tin không mang tính khẩn cấp.',
        rows: [
          {
            scale: '1000',
            purpose: 'Chữ & Nền chính (Text / Fill)',
            purposeDesc: 'Chữ hộp thông tin hướng dẫn, badge Info và nhãn phân loại.',
            contrast: '>= 4.5:1',
            suggest: 'Dùng cho văn bản thông tin trên nền sáng hoặc Sky 950 (#082F49 Dark).',
            light: 'rgba(13, 118, 150, 1)',
            dark: 'rgba(14, 165, 233, 1)'
          },
          {
            scale: '800',
            purpose: 'Viền đậm (Stroke strong)',
            purposeDesc: 'Icon chữ (i) hướng dẫn, đường viền nhấn cho biểu đồ phụ.',
            contrast: '>= 3:1',
            suggest: 'Tạo điểm nhấn thông tin nhẹ nhàng hơn Brand.',
            light: 'rgba(13, 118, 150, 0.78)',
            dark: 'rgba(56, 189, 248, 1)'
          },
          {
            scale: '200',
            purpose: 'Viền nhẹ (Stroke weak)',
            purposeDesc: 'Viền callout mẹo sử dụng, viền thẻ gợi ý AI.',
            contrast: 'Không yêu cầu',
            suggest: 'Phân tách khung hướng dẫn với nội dung chính.',
            light: 'rgba(13, 118, 150, 0.18)',
            dark: 'rgba(7, 89, 133, 1)'
          },
          {
            scale: '50',
            purpose: 'Nền nhạt (Fill / Dark Sky 950)',
            purposeDesc: 'Nền hộp mẹo nhanh (Tip box), nền tag phân loại bổ trợ.',
            contrast: 'Không yêu cầu',
            suggest: 'Nền đặc #082F49 kết hợp chữ #0EA5E9 ở Dark Mode.',
            light: 'rgba(13, 118, 150, 0.08)',
            dark: 'rgba(8, 47, 73, 1)'
          }
        ]
      },
      {
        id: 'orange',
        category: 'system',
        name: 'Orange — Cam (Nổi bật & Danh mục Mới)',
        desc: 'Màu nhấn ấm dùng cho Badge phân loại nổi bật, nhãn tính năng Hot/Mới, cảnh báo ưu tiên vừa và chỉ số tương tác.',
        rows: [
          {
            scale: '1000',
            purpose: 'Chữ & Nền chính (Text / Solid Fill)',
            purposeDesc: 'Nền Badge Orange Solid, văn bản & icon bên trong Badge Orange Soft.',
            contrast: '>= 4.5:1',
            suggest: 'Tương phản rõ trên nền trắng lẫn chữ trắng khi dùng Solid Badge.',
            light: 'rgba(234, 98, 12, 1)',
            dark: 'rgba(251, 146, 60, 1)'
          },
          {
            scale: '800',
            purpose: 'Viền đậm (Stroke strong)',
            purposeDesc: 'Biểu đồ chuỗi dữ liệu cam, đường nhấn trạng thái.',
            contrast: '>= 3:1',
            suggest: 'Dùng cho icon và viền nhấn màu cam.',
            light: 'rgba(234, 98, 12, 0.78)',
            dark: 'rgba(253, 186, 116, 1)'
          },
          {
            scale: '200',
            purpose: 'Viền nhẹ (Badge Soft Border)',
            purposeDesc: 'Viền bao quanh Orange Soft Badge hoặc callout nhấn nhẹ.',
            contrast: 'Không yêu cầu',
            suggest: 'Tạo đường biên tinh tế cho Badge nền Orange 50 / Dark 950.',
            light: 'rgba(234, 98, 12, 0.24)',
            dark: 'rgba(124, 45, 18, 1)'
          },
          {
            scale: '50',
            purpose: 'Nền nhạt (Fill / Dark Orange 950)',
            purposeDesc: 'Nền Orange Soft Badge, nhãn danh mục nổi bật.',
            contrast: 'Không yêu cầu',
            suggest: 'Kết hợp cùng chữ & icon Orange 1000 trên #431407 Dark.',
            light: 'rgba(234, 98, 12, 0.09)',
            dark: 'rgba(67, 20, 7, 1)'
          }
        ]
      },
      {
        id: 'purple',
        category: 'system',
        name: 'Purple — Tím (AI, Pro & Beta)',
        desc: 'Màu nhận diện đặc biệt cho nhãn tính năng AI, gói nâng cao (Pro/Enterprise), Beta tag và trạng thái sáng tạo.',
        rows: [
          {
            scale: '1000',
            purpose: 'Chữ & Nền chính (Text / Solid Fill)',
            purposeDesc: 'Nền Badge Purple Solid, chữ & icon bên trong Purple Soft Badge.',
            contrast: '>= 4.5:1',
            suggest: 'Đạt chuẩn tương phản khi kết hợp với chữ trắng hoặc nền Purple 50 / Dark 950.',
            light: 'rgba(139, 44, 184, 1)',
            dark: 'rgba(192, 132, 252, 1)'
          },
          {
            scale: '800',
            purpose: 'Viền đậm (Stroke strong)',
            purposeDesc: 'Viền thẻ tính năng AI / Pro và biểu đồ phụ.',
            contrast: '>= 3:1',
            suggest: 'Dùng cho viền và icon nhấn màu tím.',
            light: 'rgba(139, 44, 184, 0.78)',
            dark: 'rgba(216, 180, 254, 1)'
          },
          {
            scale: '200',
            purpose: 'Viền nhẹ (Badge Soft Border)',
            purposeDesc: 'Viền bao quanh Purple Soft Badge hoặc thẻ gợi ý AI.',
            contrast: 'Không yêu cầu',
            suggest: 'Tạo khung mảnh hài hòa cho nền Purple 50 / Dark 950.',
            light: 'rgba(139, 44, 184, 0.24)',
            dark: 'rgba(88, 28, 135, 1)'
          },
          {
            scale: '50',
            purpose: 'Nền nhạt (Fill / Dark Indigo 950)',
            purposeDesc: 'Nền Purple Soft Badge, nhãn gói Pro/VIP.',
            contrast: 'Không yêu cầu',
            suggest: 'Kết hợp cùng chữ & icon Purple 1000 trên #1E1B4B Dark.',
            light: 'rgba(139, 44, 184, 0.09)',
            dark: 'rgba(30, 27, 75, 1)'
          }
        ]
      }
    ];

    const COLOR_TABS_STORAGE_KEY = 'de_studio_color_tabs_v2';

    const ENTERPRISE_ARCHETYPES = [
      {
        id: 'enterprise-trust',
        tabId: 'tab-enterprise-trust',
        name: 'Enterprise Trust',
        sub: 'Slate (#F8FAFC–#0F172A) + Trust Blue (#2563EB) + Sky (#0284C7)',
        ref: 'IBM Carbon, Atlassian',
        brandHex: 'rgba(37, 99, 235, 1)',
        brandHover: 'rgba(29, 78, 216, 1)',
        brandDeep: 'rgba(30, 58, 138, 1)',
        brandSoft: 'rgba(239, 246, 255, 1)',
        brandBorder: 'rgba(191, 219, 254, 1)',
        brandRing: 'rgba(37, 99, 235, 0.22)',
        brandDark: 'rgba(96, 165, 250, 1)',
        brandDarkSoft: 'rgba(23, 37, 84, 1)',
        brandOklch: 'oklch(54.6% 0.215 262.9)',
        neutral: 'slate'
      },
      {
        id: 'modern-product',
        tabId: 'tab-modern-product',
        name: 'Modern Product & AI',
        sub: 'Zinc (#FAFAFA–#18181B) + Modern Indigo (#4F46E5) + Violet (#7C3AED)',
        ref: 'Linear, Stripe, shadcn/ui',
        brandHex: 'rgba(79, 70, 229, 1)',
        brandHover: 'rgba(67, 56, 202, 1)',
        brandDeep: 'rgba(49, 46, 129, 1)',
        brandSoft: 'rgba(238, 242, 255, 1)',
        brandBorder: 'rgba(199, 210, 254, 1)',
        brandRing: 'rgba(79, 70, 229, 0.22)',
        brandDark: 'rgba(129, 140, 248, 1)',
        brandDarkSoft: 'rgba(30, 27, 75, 1)',
        brandOklch: 'oklch(51.1% 0.230 277.0)',
        neutral: 'zinc'
      },
      {
        id: 'data-observability',
        tabId: 'tab-data-observability',
        name: 'Data & Observability',
        sub: 'Cool Gray (#F9FAFB–#111827) + Deep Sky (#0369A1) + Indigo (#6366F1)',
        ref: 'Carbon Charts, Radix Themes',
        brandHex: 'rgba(3, 105, 161, 1)',
        brandHover: 'rgba(7, 89, 133, 1)',
        brandDeep: 'rgba(12, 74, 110, 1)',
        brandSoft: 'rgba(240, 249, 255, 1)',
        brandBorder: 'rgba(186, 230, 253, 1)',
        brandRing: 'rgba(3, 105, 161, 0.22)',
        brandDark: 'rgba(56, 189, 248, 1)',
        brandDarkSoft: 'rgba(8, 47, 73, 1)',
        brandOklch: 'oklch(50.0% 0.119 242.7)',
        neutral: 'gray'
      }
    ];

    const ENTERPRISE_VIZ_PALETTES = {
      enterprise: [
        { seq: 'Series 1', name: 'Primary Blue', hex: '#2563EB', oklch: 'oklch(54.6% 0.215 262.9)', cr: '5.17:1 / 3.45:1' },
        { seq: 'Series 2', name: 'Violet', hex: '#7C3AED', oklch: 'oklch(54.1% 0.247 293.0)', cr: '5.70:1 / 3.13:1' },
        { seq: 'Series 3', name: 'Teal', hex: '#0D9488', oklch: 'oklch(60.0% 0.104 184.7)', cr: '3.74:1 / 4.77:1' },
        { seq: 'Series 4', name: 'Amber', hex: '#D97706', oklch: 'oklch(66.6% 0.157 58.3)', cr: '3.19:1 / 5.60:1' },
        { seq: 'Series 5', name: 'Rose', hex: '#E11D48', oklch: 'oklch(58.6% 0.222 17.6)', cr: '4.70:1 / 3.80:1' },
        { seq: 'Series 6', name: 'Sky Blue', hex: '#0284C7', oklch: 'oklch(58.8% 0.139 242.0)', cr: '4.10:1 / 4.36:1' },
        { seq: 'Series 7', name: 'Indigo', hex: '#4F46E5', oklch: 'oklch(51.1% 0.230 277.0)', cr: '6.29:1 / 2.84:1' },
        { seq: 'Series 8', name: 'Slate Benchmark', hex: '#64748B', oklch: 'oklch(55.4% 0.041 257.4)', cr: '4.76:1 / 3.75:1' }
      ],
      okabeIto: [
        { seq: 'Series 1', name: 'Blue', hex: '#0072B2', oklch: 'oklch(53.2% 0.131 244.0)', cr: '5.19:1 / 3.44:1' },
        { seq: 'Series 2', name: 'Orange', hex: '#E69F00', oklch: 'oklch(75.3% 0.158 76.8)', cr: '2.25:1 / 7.93:1' },
        { seq: 'Series 3', name: 'Bluish Green', hex: '#009E73', oklch: 'oklch(62.0% 0.130 165.5)', cr: '3.42:1 / 5.22:1' },
        { seq: 'Series 4', name: 'Sky Blue', hex: '#56B4E9', oklch: 'oklch(73.5% 0.117 236.2)', cr: '2.31:1 / 7.74:1' },
        { seq: 'Series 5', name: 'Reddish Purple', hex: '#CC79A7', oklch: 'oklch(67.9% 0.118 346.3)', cr: '3.06:1 / 5.83:1' },
        { seq: 'Series 6', name: 'Vermilion', hex: '#D55E00', oklch: 'oklch(62.1% 0.170 47.5)', cr: '3.87:1 / 4.62:1' },
        { seq: 'Series 7', name: 'Yellow', hex: '#F0E442', oklch: 'oklch(90.2% 0.172 105.0)', cr: '1.32:1 / 13.5:1' },
        { seq: 'Series 8', name: 'Dark Slate', hex: '#334155', oklch: 'oklch(37.2% 0.039 257.3)', cr: '10.35:1 / 1.72:1' }
      ]
    };

    function buildEnterpriseColorGroups(archetypeId = 'enterprise-trust') {
      const arch = ENTERPRISE_ARCHETYPES.find(a => a.id === archetypeId) || ENTERPRISE_ARCHETYPES[0];
      const neutralMap = {
        slate: {
          title: t('Slate — Xám Lam Lạnh (Ground & Structure 80%)', 'Slate — Cool Neutral Gray (Ground & Structure 80%)'),
          s1000L: 'rgba(15, 23, 42, 1)', s900L: 'rgba(30, 41, 59, 1)', s800L: 'rgba(51, 65, 85, 1)', s700L: 'rgba(100, 116, 139, 1)',
          s500L: 'rgba(148, 163, 184, 1)', s300L: 'rgba(203, 213, 225, 1)', s200L: 'rgba(226, 232, 240, 1)', s100L: 'rgba(241, 245, 249, 1)', s50L: 'rgba(248, 250, 252, 1)', s25L: 'rgba(255, 255, 255, 1)',
          s1000D: 'rgba(248, 250, 252, 1)', s900D: 'rgba(203, 213, 225, 1)', s800D: 'rgba(148, 163, 184, 1)', s700D: 'rgba(148, 163, 184, 1)',
          s500D: 'rgba(71, 85, 105, 1)', s300D: 'rgba(51, 65, 85, 1)', s200D: 'rgba(30, 41, 59, 1)', s100D: 'rgba(30, 41, 59, 1)', s50D: 'rgba(15, 23, 42, 1)', s25D: 'rgba(2, 6, 23, 1)'
        },
        zinc: {
          title: t('Zinc — Xám Kim Loại Tối Giản (Linear / shadcn/ui)', 'Zinc — Crisp Graphite Neutral (Linear / shadcn/ui)'),
          s1000L: 'rgba(24, 24, 27, 1)', s900L: 'rgba(39, 39, 42, 1)', s800L: 'rgba(63, 63, 70, 1)', s700L: 'rgba(113, 113, 122, 1)',
          s500L: 'rgba(161, 161, 170, 1)', s300L: 'rgba(212, 212, 216, 1)', s200L: 'rgba(228, 228, 231, 1)', s100L: 'rgba(244, 244, 245, 1)', s50L: 'rgba(250, 250, 250, 1)', s25L: 'rgba(255, 255, 255, 1)',
          s1000D: 'rgba(250, 250, 250, 1)', s900D: 'rgba(212, 212, 216, 1)', s800D: 'rgba(161, 161, 170, 1)', s700D: 'rgba(161, 161, 170, 1)',
          s500D: 'rgba(82, 82, 91, 1)', s300D: 'rgba(63, 63, 70, 1)', s200D: 'rgba(39, 39, 42, 1)', s100D: 'rgba(39, 39, 42, 1)', s50D: 'rgba(24, 24, 27, 1)', s25D: 'rgba(9, 9, 11, 1)'
        },
        gray: {
          title: t('Cool Gray — Trung Dung Phân Tích Dữ Liệu (Carbon / Radix)', 'Cool Gray — Balanced Analytics Neutral (Carbon / Radix)'),
          s1000L: 'rgba(17, 24, 39, 1)', s900L: 'rgba(31, 41, 55, 1)', s800L: 'rgba(55, 65, 81, 1)', s700L: 'rgba(107, 114, 128, 1)',
          s500L: 'rgba(156, 163, 175, 1)', s300L: 'rgba(209, 213, 219, 1)', s200L: 'rgba(229, 231, 235, 1)', s100L: 'rgba(243, 244, 246, 1)', s50L: 'rgba(249, 250, 251, 1)', s25L: 'rgba(255, 255, 255, 1)',
          s1000D: 'rgba(249, 250, 251, 1)', s900D: 'rgba(209, 213, 219, 1)', s800D: 'rgba(156, 163, 175, 1)', s700D: 'rgba(156, 163, 175, 1)',
          s500D: 'rgba(75, 85, 99, 1)', s300D: 'rgba(55, 65, 81, 1)', s200D: 'rgba(31, 41, 55, 1)', s100D: 'rgba(31, 41, 55, 1)', s50D: 'rgba(17, 24, 39, 1)', s25D: 'rgba(3, 7, 18, 1)'
        }
      };
      const n = neutralMap[arch.neutral] || neutralMap.slate;
      return [
        {
          id: 'grey',
          category: 'neutral',
          name: n.title,
          desc: t(
            'Dải màu trung tính đặc pha sắc độ OKLCH (Chroma 0.003–0.041) gánh >80% diện tích UI (60% Ground + 30% Structure), phân tầng bề mặt Light/Dark chuẩn WCAG AA/AAA.',
            'Solid OKLCH-tinted neutral scale (Chroma 0.003–0.041) carrying >80% of UI surfaces (60% Ground + 30% Structure) with WCAG AA/AAA Light & Dark layering.'
          ),
          calloutTitle: t('Surface Layering & Tương phản OKLCH', 'Surface Layering & OKLCH Contrast'),
          calloutDesc: t(
            'Chữ chính Step 900 đạt 17.85:1 (AAA). Chữ phụ Light dùng Step 500 (4.76:1 AA); Dark dùng Step 400 (6.96:1 AA) để tránh mờ nhòe.',
            'Primary text Step 900 achieves 17.85:1 (AAA). Secondary Light text uses Step 500 (4.76:1 AA); Dark uses Step 400 (6.96:1 AA) to prevent blur.'
          ),
          rows: [
            { scale: '1000', purpose: t('Văn bản chính (Slate 900 / Dark Slate 50)', 'Primary Text (Slate 900 / Dark Slate 50)'), purposeDesc: t('Tiêu đề chính, chỉ số KPI và chữ độ tương phản cao (APCA Lc 90).', 'Main headings, KPI figures & high-contrast copy (APCA Lc 90).'), contrast: '17.85:1 (AAA)', suggest: t('oklch(20.8% 0.04 265.8) — Step 12.', 'oklch(20.8% 0.04 265.8) — Step 12.'), light: n.s1000L, dark: n.s1000D },
            { scale: '900', purpose: t('Hover Tối & Chữ phụ nổi (Slate 800 / Dark 300)', 'Dark Hover & Emphasized Subtext (Slate 800 / Dark 300)'), purposeDesc: t('Bề mặt nổi cấp 2 Dark Mode, Hover Dark Button.', 'Level-2 elevated surface in Dark Mode & dark button hover state.'), contrast: '14.63:1', suggest: 'oklch(27.9% 0.037 260.0).', light: n.s900L, dark: n.s900D },
            { scale: '800', purpose: t('Body Copy Đậm (Slate 700 / Dark 400)', 'Strong Body Copy (Slate 700 / Dark 400)'), purposeDesc: t('Đoạn văn bản nội dung và viền Interactive Dark Mode.', 'Body paragraphs and interactive Dark Mode borders.'), contrast: '10.35:1', suggest: 'oklch(37.2% 0.039 257.3).', light: n.s800L, dark: n.s800D },
            { scale: '700', purpose: t('Văn bản phụ chuẩn AA (Slate 500 / Dark 400)', 'AA Secondary Text (Slate 500 / Dark 400)'), purposeDesc: t('Cấp nhạt nhất đạt AA (4.76:1) trên nền trắng; Dark nâng lên Step 400 (6.96:1).', 'Lightest text step passing AA (4.76:1) on white; Dark uses Step 400 (6.96:1).'), contrast: '4.76:1 / 6.96:1', suggest: 'oklch(55.4% 0.041 257.4) — APCA Lc 60.', light: n.s700L, dark: n.s700D },
            { scale: '500', purpose: t('Disabled & Icon trang trí (Slate 400 / Dark 600)', 'Disabled & Decorative Icons (Slate 400 / Dark 600)'), purposeDesc: t('Chỉ dùng cho trạng thái khóa (Disabled) hoặc icon phụ không mang chữ.', 'Reserved exclusively for disabled controls or non-text decorative icons.'), contrast: '2.56:1 (UI)', suggest: 'oklch(71.1% 0.035 256.8).', light: n.s500L, dark: n.s500D },
            { scale: '300', purpose: t('Viền Tương tác (Input Border — Step 300 / Dark 700)', 'Interactive Border (Input Border — Step 300 / Dark 700)'), purposeDesc: t('Đường viền ô nhập liệu, nút phụ Secondary Button.', 'Form input borders and secondary button outlines.'), contrast: '1.48:1', suggest: 'oklch(86.9% 0.02 252.9).', light: n.s300L, dark: n.s300D },
            { scale: '200', purpose: t('Viền Cấu trúc (Card & Table Divider — Step 200 / 800)', 'Structural Divider (Card & Table — Step 200 / 800)'), purposeDesc: t('Đường phân cách bảng dữ liệu, viền Card & Sidebar.', 'Table row dividers, card borders & sidebar separators.'), contrast: '1.23:1', suggest: 'oklch(92.9% 0.013 255.5) — Step 6.', light: n.s200L, dark: n.s200D },
            { scale: '100', purpose: t('Nền Phụ & Striped Row (Step 100 / Dark 800)', 'Subtle Surface & Striped Row (Step 100 / Dark 800)'), purposeDesc: t('Nền Sidebar, hover nhẹ trên nền trắng, dòng bảng xen kẽ.', 'Sidebar fills, subtle hover rows on white & zebra striping.'), contrast: '1.10:1', suggest: 'oklch(96.8% 0.007 247.9) — Step 3.', light: n.s100L, dark: n.s100D },
            { scale: '50', purpose: t('App Canvas Light / Card Surface Dark', 'App Canvas Light / Card Surface Dark'), purposeDesc: t('Nền khung ứng dụng (#F8FAFC) hoặc Card nâng bậc (#0F172A Dark).', 'Workspace canvas (#F8FAFC Light) or elevated card surface (#0F172A Dark).'), contrast: '1.05:1', suggest: 'oklch(98.4% 0.003 247.9) — Step 1.', light: n.s50L, dark: n.s50D },
            { scale: '25', purpose: t('Card Surface Light / Deep Canvas Dark (#020617)', 'Card Surface Light / Deep Canvas Dark (#020617)'), purposeDesc: t('Mặt thẻ #FFFFFF ở Light và nền sâu #020617 ở Dark Mode.', 'Pure #FFFFFF card surface in Light and #020617 deep canvas in Dark Mode.'), contrast: 'Surface Elevation', suggest: t('Phân tầng độ sáng bề mặt.', 'Functional lightness surface stepping.'), light: n.s25L, dark: n.s25D }
          ]
        },
        {
          id: 'brand',
          category: 'brand',
          name: `Brand — Signal 10% (${arch.name.replace(/^\d+\.\s*/, '')})`,
          desc: t(
            'Tiết chế trong nhóm 10% diện tích tín hiệu: dùng Step 600 làm nút Primary mặc định (đạt AA >= 5.17:1 với chữ trắng) và Step 700 khi Hover.',
            'Restrained within the 10% signal budget: uses Step 600 for default Primary CTAs (passing AA ≥ 5.17:1 on white) and Step 700 for Hover.'
          ),
          calloutTitle: t('Chuẩn WCAG cho Primary CTA (Step 600 / 700)', 'WCAG Rule for Primary CTA (Step 600 / 700)'),
          calloutDesc: t(
            `Step 500 (#3B82F6) chỉ đạt 3.68:1 với chữ trắng nên dùng cho Dark Mode; Light Mode bắt buộc dùng Step 600 (${arch.brandOklch}) để đạt AA.`,
            `Step 500 (#3B82F6) only scores 3.68:1 on white text, so it is reserved for Dark Mode; Light Mode uses Step 600 (${arch.brandOklch}) for AA compliance.`
          ),
          rows: [
            { scale: '1200', purpose: t('Văn bản nhấn đậm (Step 900)', 'Deep Accent Text (Step 900)'), purposeDesc: t('Tiêu đề trong Banner thông báo trên nền xanh nhạt.', 'Banner headings over soft tinted brand surfaces.'), contrast: '10.36:1 (AAA)', suggest: 'oklch(37.9% 0.138 265.5).', light: arch.brandDeep, dark: arch.brandBorder },
            { scale: '1100', purpose: t('Primary Button Hover (Step 700)', 'Primary Button Hover (Step 700)'), purposeDesc: t('Trạng thái di chuột nút CTA chính với chữ trắng.', 'Primary CTA hover background with white text.'), contrast: '6.70:1 (AA+)', suggest: 'oklch(48.8% 0.217 264.4).', light: arch.brandHover, dark: arch.brandDark },
            { scale: '1000', purpose: t('Primary CTA Default (Step 600 / Dark 500)', 'Primary CTA Default (Step 600 / Dark 500)'), purposeDesc: t('Nút hành động chính, link điều hướng active.', 'Primary actions and active navigation highlights.'), contrast: '5.17:1 (AA)', suggest: `${arch.brandOklch}.`, light: arch.brandHex, dark: arch.brandDark },
            { scale: '800', purpose: t('Text Link & Tinted Label (Step 700)', 'Text Link & Tinted Label (Step 700)'), purposeDesc: t('Chữ nhấn trên nền Step 50 và liên kết tương tác.', 'Interactive links and tinted label text over Step 50.'), contrast: '6.70:1 (AA+)', suggest: t('Đảm bảo đọc rõ trên nền Tinted.', 'Ensures crisp legibility on tinted backgrounds.'), light: arch.brandHover, dark: arch.brandDark },
            { scale: 'ring', purpose: t('Focus Ring bàn phím (--border-focus)', 'Keyboard Focus Ring (--border-focus)'), purposeDesc: t('Vòng lấy nét Input & Button hỗ trợ Accessibility.', 'Accessible focus halo around inputs and action buttons.'), contrast: '>= 3.0:1 UI', suggest: t('Kết hợp 3px halo Focus Ring.', 'Pair with a 3px focus ring halo.'), light: arch.brandRing, dark: 'rgba(59, 130, 246, 0.35)' },
            { scale: '200', purpose: t('Viền Alert & Active Border (Step 200)', 'Alert & Active Border (Step 200)'), purposeDesc: t('Đường viền hộp thông báo và thẻ đang chọn.', 'Outlines for informational banners and active cards.'), contrast: '1.42:1', suggest: 'oklch(88.2% 0.057 254.1).', light: arch.brandBorder, dark: 'rgba(30, 64, 175, 0.7)' },
            { scale: '50', purpose: t('Selected Row / Subtle Accent Surface (Step 50 / 950)', 'Selected Row / Subtle Accent Surface (Step 50 / 950)'), purposeDesc: t('Nền dòng bảng đang chọn và mục Sidebar Active.', 'Selected table row fills and active sidebar backgrounds.'), contrast: '1.09:1', suggest: t('Nền Tinted đặc ổn định xuyên bề mặt.', 'Solid tinted surface consistent across layers.'), light: arch.brandSoft, dark: arch.brandDarkSoft }
          ]
        },
        {
          id: 'green',
          category: 'system',
          name: 'Success — Emerald (Step 700 Light / Step 500 Dark)',
          desc: t(
            'Dùng Step 700 (#047857) cho chữ/nút AA trên nền sáng (5.48:1) thay vì Step 500 (2.54:1 Fail); Dark Mode dùng Step 500 (#10B981, 7.04:1) trên nền Step 950 (#022C22).',
            'Uses Step 700 (#047857) for AA text/badges on Light surfaces (5.48:1 vs Step 500 2.54:1 Fail); Dark Mode uses Step 500 (#10B981, 7.04:1) over Step 950 (#022C22).'
          ),
          rows: [
            { scale: '1000', purpose: t('Chữ Badge / Nút Thành công AA (Emerald 700 / Dark 500)', 'AA Success Text / Badge (Emerald 700 / Dark 500)'), purposeDesc: t('Trạng thái Active, Deployed, Verified.', 'Active, Deployed, Succeeded and Verified states.'), contrast: '5.48:1 / 7.04:1', suggest: 'oklch(50.8% 0.105 165.6).', light: 'rgba(4, 120, 87, 1)', dark: 'rgba(16, 185, 129, 1)' },
            { scale: '800', purpose: t('Icon & Đường biểu đồ (Emerald 600)', 'Icons & Chart Series (Emerald 600)'), purposeDesc: t('Icon thành công trên nền sáng & chữ lớn (>=3.0:1).', 'Success icons on light surfaces & large typography (≥3.0:1).'), contrast: '3.77:1 (UI)', suggest: 'oklch(59.6% 0.127 163.2).', light: 'rgba(5, 150, 105, 1)', dark: 'rgba(52, 211, 153, 1)' },
            { scale: '200', purpose: t('Viền Alert Thành công (Emerald 200 / 800)', 'Success Alert Border (Emerald 200 / 800)'), purposeDesc: t('Viền thẻ trạng thái thành công.', 'Borders for success alert banners and cards.'), contrast: 'Border Accent', suggest: t('Không dùng độ trong suốt thay màu đặc.', 'Avoid replacing solid border tokens with opacity.'), light: 'rgba(167, 243, 208, 1)', dark: 'rgba(6, 95, 70, 1)' },
            { scale: '50', purpose: t('Nền Tinted Badge & Alert (Emerald 50 / Dark 950)', 'Tinted Badge & Alert Surface (Emerald 50 / Dark 950)'), purposeDesc: t('Công thức chuẩn Stripe/Radix: Nền 50 + Chữ 700.', 'Stripe/Radix pairing: Step 50 fill + Step 700 text.'), contrast: '1.05:1', suggest: 'oklch(97.9% 0.021 166.1).', light: 'rgba(236, 253, 245, 1)', dark: 'rgba(2, 44, 34, 1)' }
          ]
        },
        {
          id: 'amber',
          category: 'system',
          name: 'Warning — Amber (Step 700 Light / Step 500 Dark)',
          desc: t(
            'Tránh bẫy đặt chữ trắng lên Amber 500 (2.15:1 Fail). Dùng nền Amber 50 (#FFFBEB) + chữ Amber 700 (#B45309, 5.02:1 AA) ở Light Mode.',
            'Avoids low-contrast white-on-Amber-500 (2.15:1 Fail). Pairs Amber 50 (#FFFBEB) surface with Amber 700 text (#B45309, 5.02:1 AA) in Light Mode.'
          ),
          rows: [
            { scale: '1000', purpose: t('Chữ Cảnh báo chuẩn AA (Amber 700 / Dark 500)', 'AA Warning Text (Amber 700 / Dark 500)'), purposeDesc: t('Badge Pending, Expiring Soon, Cảnh báo.', 'Pending, Expiring Soon & Warning badges.'), contrast: '5.02:1 / 8.31:1', suggest: 'oklch(55.5% 0.146 49.0).', light: 'rgba(180, 83, 9, 1)', dark: 'rgba(245, 158, 11, 1)' },
            { scale: '800', purpose: t('Icon Cảnh báo UI (Amber 600)', 'Warning UI Icons (Amber 600)'), purposeDesc: t('Icon & đường biểu đồ đạt ngưỡng đồ họa 3.19:1.', 'Icons & chart lines meeting 3.19:1 graphical contrast.'), contrast: '3.19:1 (UI)', suggest: 'oklch(66.6% 0.157 58.3).', light: 'rgba(217, 119, 6, 1)', dark: 'rgba(251, 191, 36, 1)' },
            { scale: '200', purpose: t('Viền Alert Cảnh báo (Amber 200)', 'Warning Alert Border (Amber 200)'), purposeDesc: t('Đường viền hộp cảnh báo.', 'Warning callout and alert banner outlines.'), contrast: 'Border Accent', suggest: t('Nổi bật không chói mắt.', 'Clear visual emphasis without harsh glare.'), light: 'rgba(253, 230, 138, 1)', dark: 'rgba(120, 53, 15, 1)' },
            { scale: '50', purpose: t('Nền Tinted Cảnh báo (Amber 50 / Dark 950)', 'Tinted Warning Fill (Amber 50 / Dark 950)'), purposeDesc: t('Nền Badge & Banner cảnh báo.', 'Warning badge and banner surfaces.'), contrast: '1.04:1', suggest: 'oklch(98.7% 0.021 95.3).', light: 'rgba(255, 251, 235, 1)', dark: 'rgba(69, 26, 3, 1)' }
          ]
        },
        {
          id: 'red',
          category: 'system',
          name: 'Danger — Red (Step 600 CTA / Step 700 Text)',
          desc: t(
            'Red 600 (#DC2626) đạt 4.83:1 cho nút xóa chữ trắng; Red 700 (#B91C1C) đạt 6.47:1 cho chữ lỗi trên nền Red 50 (#FEF2F2).',
            'Red 600 (#DC2626) reaches 4.83:1 for white-text destructive CTAs; Red 700 (#B91C1C) achieves 6.47:1 for error text over Red 50 (#FEF2F2).'
          ),
          rows: [
            { scale: '1000', purpose: t('Nút Destructive & Lỗi (Red 600 / Dark 500)', 'Destructive CTA & Error (Red 600 / Dark 500)'), purposeDesc: t('Nút Xóa, viền Input lỗi, thông báo nghiêm trọng.', 'Delete buttons, invalid input borders & critical errors.'), contrast: '4.83:1 / 4.74:1', suggest: 'oklch(57.7% 0.215 27.3).', light: 'rgba(220, 38, 38, 1)', dark: 'rgba(239, 68, 68, 1)' },
            { scale: '800', purpose: t('Chữ Badge Lỗi & Hover (Red 700)', 'Error Text & CTA Hover (Red 700)'), purposeDesc: t('Văn bản trên nền Red 50/100 và Hover nút xóa.', 'Body text on Red 50/100 & destructive hover state.'), contrast: '6.47:1 (AA)', suggest: 'oklch(50.5% 0.190 27.5).', light: 'rgba(185, 28, 28, 1)', dark: 'rgba(248, 113, 113, 1)' },
            { scale: '200', purpose: t('Viền Alert Lỗi (Red 200)', 'Error Alert Border (Red 200)'), purposeDesc: t('Viền hộp cảnh báo lỗi.', 'Error alert & modal outlines.'), contrast: 'Border Accent', suggest: t('Tách biệt lỗi rõ ràng.', 'Distinct error boundary contrast.'), light: 'rgba(254, 202, 202, 1)', dark: 'rgba(127, 29, 29, 1)' },
            { scale: '50', purpose: t('Nền Tinted Báo lỗi (Red 50 / Dark 950)', 'Tinted Error Fill (Red 50 / Dark 950)'), purposeDesc: t('Nền Error Callout & dòng dữ liệu lỗi.', 'Error callout backgrounds & failed table rows.'), contrast: '1.09:1', suggest: 'oklch(97.1% 0.013 17.4).', light: 'rgba(254, 242, 242, 1)', dark: 'rgba(69, 10, 10, 1)' }
          ]
        },
        {
          id: 'teal',
          category: 'system',
          name: 'Info — Sky / Cyan (Step 700 Light / Step 500 Dark)',
          desc: t(
            'Tránh chữ trắng trên Sky 500 (2.77:1 Fail). Dùng Sky 700 (#0369A1, 5.93:1 AA) cho chữ/link trên nền Sky 50 (#F0F9FF).',
            'Avoids failing white-on-Sky-500 (2.77:1 Fail). Uses Sky 700 (#0369A1, 5.93:1 AA) for text & links over Sky 50 (#F0F9FF).'
          ),
          rows: [
            { scale: '1000', purpose: t('Chữ & Link Thông tin AA (Sky 700 / Dark 500)', 'AA Info Text & Links (Sky 700 / Dark 500)'), purposeDesc: t('Badge Info, Callout hướng dẫn, Data Series 6.', 'Info badges, guidance callouts & Data Series 6.'), contrast: '5.93:1 / 6.44:1', suggest: 'oklch(50.0% 0.119 242.7).', light: 'rgba(3, 105, 161, 1)', dark: 'rgba(14, 165, 233, 1)' },
            { scale: '800', purpose: t('Icon & Đường biểu đồ (Sky 600)', 'Info Icons & Chart Series (Sky 600)'), purposeDesc: t('Icon thông tin & đồ họa dữ liệu 4.10:1.', 'Informational icons & 4.10:1 chart geometry.'), contrast: '4.10:1 (UI)', suggest: 'oklch(58.8% 0.139 242.0).', light: 'rgba(2, 132, 199, 1)', dark: 'rgba(56, 189, 248, 1)' },
            { scale: '200', purpose: t('Viền Alert Info (Sky 200)', 'Info Alert Border (Sky 200)'), purposeDesc: t('Viền hộp ghi chú hệ thống.', 'System note & tooltip border stroke.'), contrast: 'Border Accent', suggest: t('Giữ sắc lam dịu mắt.', 'Balanced cool-blue visual restraint.'), light: 'rgba(186, 230, 253, 1)', dark: 'rgba(7, 89, 133, 1)' },
            { scale: '50', purpose: t('Nền Info Callout (Sky 50 / Dark 950)', 'Info Callout Surface (Sky 50 / Dark 950)'), purposeDesc: t('Nền hộp hướng dẫn & tooltip thông tin.', 'Guidance banner & informational pill fill.'), contrast: '1.07:1', suggest: 'oklch(97.7% 0.012 236.6).', light: 'rgba(240, 249, 255, 1)', dark: 'rgba(8, 47, 73, 1)' }
          ]
        },
        {
          id: 'orange',
          category: 'system',
          name: 'Chart Accent — Enterprise Amber / Vermilion',
          desc: t(
            'Dành cho chuỗi dữ liệu biểu đồ Series 4 (#D97706) / Okabe-Ito (#D55E00) đạt >= 3.19:1 tương phản đồ họa.',
            'Designed for Chart Series 4 (#D97706) / Okabe-Ito (#D55E00) achieving ≥ 3.19:1 non-text graphical contrast.'
          ),
          rows: [
            { scale: '1000', purpose: t('Chuỗi dữ liệu & Nhãn nổi bật', 'Chart Series & Categorical Accent'), purposeDesc: t('Đồ họa dữ liệu Series 4 & badge nổi bật.', 'Series 4 visualization lines & highlight badges.'), contrast: '3.19:1 (UI)', suggest: 'oklch(66.6% 0.157 58.3).', light: 'rgba(217, 119, 6, 1)', dark: 'rgba(245, 158, 11, 1)' },
            { scale: '800', purpose: t('Hover & Chữ nhấn ấm', 'Warm Emphasis & Hover'), purposeDesc: t('Chữ đậm trên nền cam nhạt.', 'High-contrast text on pale warm surfaces.'), contrast: '5.02:1 (AA)', suggest: t('Đạt chuẩn đọc AA.', 'Meets WCAG AA text contrast.'), light: 'rgba(180, 83, 9, 1)', dark: 'rgba(251, 191, 36, 1)' },
            { scale: '200', purpose: t('Viền phân loại', 'Category Border'), purposeDesc: t('Viền thẻ danh mục.', 'Categorical chip & card outlines.'), contrast: 'Border Accent', suggest: t('Tránh nhầm với Warning.', 'Differentiate visually from Warning alerts.'), light: 'rgba(254, 215, 170, 1)', dark: 'rgba(124, 45, 18, 1)' },
            { scale: '50', purpose: t('Nền nhẹ phân loại', 'Category Soft Fill'), purposeDesc: t('Nền pill danh mục.', 'Subtle categorical tag fills.'), contrast: 'Subtle Tint', suggest: t('Chỉ dùng khi so sánh danh mục.', 'Use for categorical comparison.'), light: 'rgba(255, 247, 237, 1)', dark: 'rgba(67, 20, 7, 1)' }
          ]
        },
        {
          id: 'purple',
          category: 'system',
          name: 'AI & Modern Indigo — Indigo 600 / Violet 600',
          desc: t(
            'Màu nhấn phụ chuẩn Linear / Stripe (#4F46E5 đạt 6.29:1 AA), dùng cho tính năng AI Builder, Pro Badge & Series 2/7 biểu đồ.',
            'Secondary Linear/Stripe accent (#4F46E5 scoring 6.29:1 AA) for AI Builder triggers, Pro badges & Chart Series 2/7.'
          ),
          rows: [
            { scale: '1000', purpose: t('AI Accent & Series 7 (Indigo 600 / Dark 500)', 'AI Accent & Series 7 (Indigo 600 / Dark 500)'), purposeDesc: t('Nút AI Builder, badge Beta/Pro, chuỗi biểu đồ.', 'AI Builder controls, Beta/Pro badges & chart series.'), contrast: '6.29:1 / 4.00:1', suggest: 'oklch(51.1% 0.230 277.0).', light: 'rgba(79, 70, 229, 1)', dark: 'rgba(99, 102, 241, 1)' },
            { scale: '800', purpose: t('Hover AI & Violet (Indigo 700)', 'AI Hover & Violet Text (Indigo 700)'), purposeDesc: t('Trạng thái Hover & chữ đậm trên nền Indigo 50.', 'Hover state & crisp text over Indigo 50.'), contrast: '7.90:1 (AAA)', suggest: 'oklch(45.7% 0.215 277.0).', light: 'rgba(67, 56, 202, 1)', dark: 'rgba(129, 140, 248, 1)' },
            { scale: '200', purpose: t('Viền AI Panel (Indigo 200)', 'AI Panel Border (Indigo 200)'), purposeDesc: t('Viền thẻ gợi ý AI.', 'Outlines for AI suggestion cards & panels.'), contrast: '1.49:1', suggest: 'oklch(87.0% 0.062 274.0).', light: 'rgba(199, 210, 254, 1)', dark: 'rgba(55, 48, 163, 1)' },
            { scale: '50', purpose: t('Nền AI Surface (Indigo 50 / Dark 950)', 'AI Soft Surface (Indigo 50 / Dark 950)'), purposeDesc: t('Nền nhạt tính năng AI & pill nâng cấp.', 'Subtle fills for AI highlights & upgrade pills.'), contrast: '1.12:1', suggest: 'oklch(96.2% 0.018 272.3).', light: 'rgba(238, 242, 255, 1)', dark: 'rgba(30, 27, 75, 1)' }
          ]
        }
      ];
    }

    function getColorTabDisplayName(tab) {
      if (!tab) return '';
      if (tab.kind === 'default' || tab.id === 'tab-default') {
        return t('De Studio Gốc', 'De Studio Default');
      }
      if (tab.archetypeId) {
        const arch = ENTERPRISE_ARCHETYPES.find(a => a.id === tab.archetypeId);
        if (arch) return arch.name;
      }
      return tab.name || '';
    }

    function getColorTabSubtitle(tab) {
      if (!tab) return '';
      if (tab.kind === 'default' || tab.id === 'tab-default') {
        return t('Màu trong suốt (Transparent Colors • Giữ nguyên gốc)', 'Transparent Colors • Base De Studio Palette');
      }
      if (tab.archetypeId) {
        const arch = ENTERPRISE_ARCHETYPES.find(a => a.id === tab.archetypeId);
        if (arch) return `${arch.sub} • ${t('Chuẩn:', 'Standard:')} ${arch.ref}`;
      }
      return tab.subtitle || '';
    }

    function getLocalizedColorGroups(tab) {
      if (!tab || !Array.isArray(tab.groups)) return colorGroups;
      if (tab.kind !== 'enterprise') return tab.groups;
      const tmpl = buildEnterpriseColorGroups(tab.archetypeId || colorTabsState.enterpriseArchetype);
      return tab.groups.map((grp, gi) => {
        const tg = tmpl[gi];
        if (!tg) return grp;
        return Object.assign({}, grp, {
          name: tg.name,
          desc: tg.desc,
          calloutTitle: tg.calloutTitle,
          calloutDesc: tg.calloutDesc,
          rows: grp.rows.map((row, ri) => {
            const tr = tg.rows[ri];
            if (!tr) return row;
            return Object.assign({}, row, {
              purpose: tr.purpose,
              purposeDesc: tr.purposeDesc,
              contrast: tr.contrast,
              suggest: tr.suggest
            });
          })
        });
      });
    }

    function loadColorTabsState() {
      const tabDefaultGroups = JSON.parse(JSON.stringify(DEFAULT_COLOR_GROUPS));
      // Migrate legacy v1 overrides into Default tab if present
      try {
        const legacyRaw = localStorage.getItem(COLORS_STORAGE_KEY);
        if (legacyRaw) {
          const ov = JSON.parse(legacyRaw);
          tabDefaultGroups.forEach(group => {
            group.rows.forEach(row => {
              if (ov[`${group.id}.${row.scale}.light`]) row.light = ov[`${group.id}.${row.scale}.light`];
              if (ov[`${group.id}.${row.scale}.dark`]) row.dark = ov[`${group.id}.${row.scale}.dark`];
            });
          });
        }
      } catch (e) {}

      // 3 Enterprise SaaS theme tabs first, De Studio Default (Base) placed LAST
      const canonicalTabs = [
        ...ENTERPRISE_ARCHETYPES.map(arch => ({
          id: arch.tabId,
          kind: 'enterprise',
          archetypeId: arch.id,
          name: arch.name,
          subtitle: `${arch.sub} • Standard: ${arch.ref}`,
          groups: buildEnterpriseColorGroups(arch.id)
        })),
        {
          id: 'tab-default',
          kind: 'default',
          name: 'De Studio Gốc',
          subtitle: 'Màu trong suốt (Transparent Colors • Giữ nguyên gốc)',
          groups: tabDefaultGroups
        }
      ];

      const defaults = {
        viewingTabId: 'tab-default',
        appliedTabId: 'tab-default',
        enterpriseArchetype: 'enterprise-trust',
        vizPaletteMode: 'enterprise',
        tabs: canonicalTabs
      };

      const applyBuilcolorToDefaultTab = (targetTab) => {
        if (!targetTab || !Array.isArray(targetTab.groups)) return false;
        let hasBuilcolorApplied = false;

        try {
          const customPaletteRaw = localStorage.getItem('de_studio_active_brand_palette');
          if (customPaletteRaw) {
            const pal = JSON.parse(customPaletteRaw);
            if (pal) {
              hasBuilcolorApplied = true;
              if (pal.shades) {
                const bg = targetTab.groups.find(g => g.id === 'brand');
                if (bg && Array.isArray(bg.rows)) {
                  bg.rows.forEach(row => {
                    if (pal.shades[row.scale]) {
                      row.light = pal.shades[row.scale].light;
                      row.dark = pal.shades[row.scale].dark;
                    }
                  });
                }
              }
              if (pal.neutralShades) {
                const gg = targetTab.groups.find(g => g.id === 'grey');
                if (gg && Array.isArray(gg.rows)) {
                  gg.rows.forEach(row => {
                    if (pal.neutralShades[row.scale]) {
                      row.light = pal.neutralShades[row.scale].light;
                      row.dark = pal.neutralShades[row.scale].dark;
                    }
                  });
                }
              }
              if (pal.systemShades && typeof pal.systemShades === 'object') {
                ['red', 'amber', 'green', 'teal', 'orange', 'purple'].forEach(sysId => {
                  const sg = targetTab.groups.find(g => g.id === sysId);
                  const sysMap = pal.systemShades[sysId];
                  if (sg && Array.isArray(sg.rows) && sysMap) {
                    sg.rows.forEach(row => {
                      if (sysMap[row.scale]) {
                        row.light = sysMap[row.scale].light;
                        row.dark = sysMap[row.scale].dark;
                      }
                    });
                  }
                });
              }
            }
          }
        } catch (e) {}

        try {
          const customNeutralRaw = localStorage.getItem('de_studio_active_neutral_palette');
          if (customNeutralRaw) {
            const npal = JSON.parse(customNeutralRaw);
            if (npal && npal.shades) {
              hasBuilcolorApplied = true;
              const gg = targetTab.groups.find(g => g.id === 'grey');
              if (gg && Array.isArray(gg.rows)) {
                gg.rows.forEach(row => {
                  if (npal.shades[row.scale]) {
                    row.light = npal.shades[row.scale].light;
                    row.dark = npal.shades[row.scale].dark;
                  }
                });
              }
            }
          }
        } catch (e) {}

        try {
          const customSysRaw = localStorage.getItem('de_studio_active_system_palette');
          if (customSysRaw) {
            const spal = JSON.parse(customSysRaw);
            if (spal && spal.shades && typeof spal.shades === 'object') {
              hasBuilcolorApplied = true;
              ['red', 'amber', 'green', 'teal', 'orange', 'purple'].forEach(sysId => {
                const sg = targetTab.groups.find(g => g.id === sysId);
                const sysMap = spal.shades[sysId];
                if (sg && Array.isArray(sg.rows) && sysMap) {
                  sg.rows.forEach(row => {
                    if (sysMap[row.scale]) {
                      row.light = sysMap[row.scale].light;
                      row.dark = sysMap[row.scale].dark;
                    }
                  });
                }
              });
            }
          }
        } catch (e) {}

        return hasBuilcolorApplied;
      };

      try {
        const saved = localStorage.getItem(COLOR_TABS_STORAGE_KEY);
        if (!saved) {
          const defaultTab = canonicalTabs.find(t => t.id === 'tab-default');
          applyBuilcolorToDefaultTab(defaultTab);
          return defaults;
        }
        const parsed = JSON.parse(saved);
        if (!parsed || !Array.isArray(parsed.tabs)) {
          const defaultTab = canonicalTabs.find(t => t.id === 'tab-default');
          applyBuilcolorToDefaultTab(defaultTab);
          return defaults;
        }

        // Only restore overrides for tab-default; keep 3 enterprise archetypes 100% pristine from backup
        const prevDefault = parsed.tabs.find(pt => pt && pt.id === 'tab-default');
        const defaultTab = canonicalTabs.find(t => t.id === 'tab-default');
        if (prevDefault && Array.isArray(prevDefault.groups) && defaultTab) {
          defaultTab.groups = prevDefault.groups;
        }

        const hasBuilcolor = applyBuilcolorToDefaultTab(defaultTab);

        const validIds = canonicalTabs.map(t => t.id);
        let pickedTabId = validIds.includes(parsed.appliedTabId)
          ? parsed.appliedTabId
          : (validIds.includes(parsed.viewingTabId) ? parsed.viewingTabId : 'tab-default');

        // If user clicked Apply from Builcolor, ensure tab-default is selected when appliedTabId was set to tab-default
        if (hasBuilcolor && (!parsed.appliedTabId || parsed.appliedTabId === 'tab-default')) {
          pickedTabId = 'tab-default';
        }
        const activeTab = canonicalTabs.find(t => t.id === pickedTabId) || canonicalTabs[canonicalTabs.length - 1];

        return {
          viewingTabId: activeTab.id,
          appliedTabId: activeTab.id,
          enterpriseArchetype: activeTab.archetypeId || parsed.enterpriseArchetype || 'enterprise-trust',
          vizPaletteMode: parsed.vizPaletteMode || 'enterprise',
          tabs: canonicalTabs
        };
      } catch (e) {
        const defaultTab = canonicalTabs.find(t => t.id === 'tab-default');
        applyBuilcolorToDefaultTab(defaultTab);
        return defaults;
      }
    }

    let colorTabsState = loadColorTabsState();
    function getAppliedColorTab() {
      return colorTabsState.tabs.find(t => t.id === colorTabsState.appliedTabId) || colorTabsState.tabs[colorTabsState.tabs.length - 1];
    }
    function getViewingColorTab() {
      return colorTabsState.tabs.find(t => t.id === colorTabsState.viewingTabId) || getAppliedColorTab();
    }

    let colorGroups = getAppliedColorTab().groups;
    let editingColorRef = null; // { tabId, groupId, scale, mode, r, g, b, a }

    function saveColorTabsState() {
      colorGroups = getAppliedColorTab().groups;
      try {
        localStorage.setItem(COLOR_TABS_STORAGE_KEY, JSON.stringify(colorTabsState));
      } catch (e) {}
      syncBrandTokensToCSS();
    }

    function saveColorOverrides() {
      saveColorTabsState();
    }

    function countCustomizedColors(tabObj) {
      const tab = tabObj || getViewingColorTab();
      const refGroups = tab.kind === 'enterprise'
        ? buildEnterpriseColorGroups(tab.archetypeId || colorTabsState.enterpriseArchetype)
        : DEFAULT_COLOR_GROUPS;
      let count = 0;
      refGroups.forEach((defGroup, gi) => {
        const curGroup = tab.groups[gi];
        if (!curGroup) return;
        defGroup.rows.forEach((defRow, ri) => {
          const curRow = curGroup.rows[ri];
          if (!curRow) return;
          if (curRow.light !== defRow.light) count++;
          if (curRow.dark !== defRow.dark) count++;
        });
      });
      return count;
    }

    window.selectColorTab = function(tabId) {
      const targetId = tabId === 'tab-enterprise'
        ? (`tab-${colorTabsState.enterpriseArchetype || 'enterprise-trust'}`)
        : tabId;
      const tab = colorTabsState.tabs.find(t => t.id === targetId);
      if (!tab) return;
      colorTabsState.viewingTabId = tab.id;
      colorTabsState.appliedTabId = tab.id;
      if (tab.archetypeId) {
        colorTabsState.enterpriseArchetype = tab.archetypeId;
      }
      colorGroups = tab.groups;
      saveColorTabsState();
      renderCanvas();
      const tabName = getColorTabDisplayName(tab);
      showToast(t(`✓ Đã chuyển sang theme "${tabName}"`, `✓ Switched to "${tabName}" theme`));
    };

    window.applyColorTab = function(tabId) {
      window.selectColorTab(tabId);
    };

    window.unapplyColorTab = function() {
      window.selectColorTab('tab-default');
    };

    window.setEnterpriseArchetype = function(archId) {
      const arch = ENTERPRISE_ARCHETYPES.find(a => a.id === archId);
      if (!arch) return;
      window.selectColorTab(arch.tabId);
    };

    window.setVizPaletteMode = function(mode) {
      colorTabsState.vizPaletteMode = mode;
      saveColorTabsState();
      renderCanvas();
    };

    function parseColorString(str) {
      if (!str) return null;
      const s = str.trim();
      // Match rgba(r, g, b, a) or rgb(r, g, b)
      const rgbaMatch = s.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*([0-9.]+%?))?\s*\)$/i);
      if (rgbaMatch) {
        const r = Math.min(255, Math.max(0, parseInt(rgbaMatch[1], 10)));
        const g = Math.min(255, Math.max(0, parseInt(rgbaMatch[2], 10)));
        const b = Math.min(255, Math.max(0, parseInt(rgbaMatch[3], 10)));
        let a = 1;
        if (rgbaMatch[4] !== undefined) {
          a = rgbaMatch[4].endsWith('%') ? parseFloat(rgbaMatch[4]) / 100 : parseFloat(rgbaMatch[4]);
        }
        a = Math.min(1, Math.max(0, isNaN(a) ? 1 : a));
        return { r, g, b, a };
      }
      // Match #RGB, #RRGGBB, #RRGGBBAA
      const hex = s.replace(/^#/, '');
      if (/^[0-9a-f]{3}$/i.test(hex)) {
        return {
          r: parseInt(hex[0] + hex[0], 16),
          g: parseInt(hex[1] + hex[1], 16),
          b: parseInt(hex[2] + hex[2], 16),
          a: 1
        };
      }
      if (/^[0-9a-f]{6}([0-9a-f]{2})?$/i.test(hex)) {
        return {
          r: parseInt(hex.slice(0, 2), 16),
          g: parseInt(hex.slice(2, 4), 16),
          b: parseInt(hex.slice(4, 6), 16),
          a: hex.length === 8 ? Math.round((parseInt(hex.slice(6, 8), 16) / 255) * 100) / 100 : 1
        };
      }
      return null;
    }

    function rgbToHex(r, g, b) {
      const toH = n => Math.min(255, Math.max(0, Math.round(n))).toString(16).padStart(2, '0');
      return `#${toH(r)}${toH(g)}${toH(b)}`.toUpperCase();
    }

    function formatRgba(r, g, b, a) {
      const cleanA = Math.round(a * 1000) / 1000;
      return `rgba(${r}, ${g}, ${b}, ${cleanA})`;
    }

    function formatSwatchDisplay(colorStr) {
      const c = parseColorString(colorStr);
      if (!c) return colorStr;
      const pct = Math.round(c.a * 1000) / 10;
      return `${c.r}, ${c.g}, ${c.b} • ${pct}% (${rgbToHex(c.r, c.g, c.b)})`;
    }

    function getContrastRatio(rgba, bgRgb) {
      // Alpha composite foreground onto background
      const r = Math.round(rgba.r * rgba.a + bgRgb.r * (1 - rgba.a));
      const g = Math.round(rgba.g * rgba.a + bgRgb.g * (1 - rgba.a));
      const b = Math.round(rgba.b * rgba.a + bgRgb.b * (1 - rgba.a));
      const lum = ({ r, g, b }) => {
        const [rs, gs, bs] = [r, g, b].map(v => {
          const s = v / 255;
          return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
      };
      const l1 = lum({ r, g, b });
      const l2 = lum(bgRgb);
      return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    }

    function syncBrandTokensToCSS() {
      const root = document.documentElement;
      const isDark = (typeof uiTheme !== 'undefined' && uiTheme === 'dark');
      const modeKey = isDark ? 'dark' : 'light';
      root.setAttribute('data-theme', modeKey);

      const appliedTab = typeof getAppliedColorTab === 'function' ? getAppliedColorTab() : null;
      if (appliedTab && Array.isArray(appliedTab.groups)) {
        colorGroups = appliedTab.groups;
      }
      colorGroups.forEach(group => {
        group.rows.forEach(row => {
          root.style.setProperty(`--ds-${group.id}-${row.scale}`, isDark ? (row.dark || row.light) : row.light);
        });
      });
      const getScale = (gid, sc, forcedMode) => {
        const g = colorGroups.find(x => x.id === gid);
        const r = g ? g.rows.find(x => x.scale === sc) : null;
        if (!r) return null;
        const m = forcedMode || modeKey;
        return m === 'dark' ? (r.dark || r.light) : r.light;
      };

      const brandMode = getScale('brand', '1000', modeKey);
      const brandLight = getScale('brand', '1000', 'light');
      // Use white-text AA safe solid CTA fill for --brand-primary while keeping dark-surface link/accent in --brand-link
      let ctaBrand = brandMode || '#2563eb';
      if (isDark && brandMode && typeof parseCssRgba === 'function' && typeof computeWcagContrast === 'function') {
        const bgParsed = parseCssRgba(brandMode);
        if (bgParsed && bgParsed.a > 0.8) {
          const crOnWhite = computeWcagContrast({ r: 255, g: 255, b: 255, a: 1 }, bgParsed);
          if (crOnWhite < 3.0 && brandLight) ctaBrand = brandLight;
        }
      }
      root.style.setProperty('--brand-primary', ctaBrand);
      root.style.setProperty('--brand-link', brandMode || ctaBrand);
      const hoverVal = isDark
        ? (getScale('brand', '1100', 'light') || ctaBrand)
        : (getScale('brand', '1100', 'light') || getScale('brand', '800', 'light') || ctaBrand);
      if (hoverVal) root.style.setProperty('--brand-primary-hover', hoverVal);
      if (getScale('brand', 'ring')) root.style.setProperty('--brand-focus-ring', getScale('brand', 'ring'));
      if (getScale('brand', '50')) root.style.setProperty('--brand-soft', getScale('brand', '50'));
      if (getScale('brand', '200')) root.style.setProperty('--brand-border', getScale('brand', '200'));

      // Check if active tab is De Studio Default (tab-default) vs the 3 OKLCH Enterprise Tabs
      const isDefaultTab = !appliedTab || appliedTab.id === 'tab-default' || appliedTab.kind === 'default';
      root.setAttribute('data-color-tab', appliedTab ? appliedTab.id : 'tab-default');

      if (isDefaultTab) {
        // Initialize Default Modern SaaS Button Gradient variables on :root
        const defaultBgGrad = 'linear-gradient(180deg, #3d61ff 0%, #2f4bec 100%)';
        const defaultBgHover = 'linear-gradient(180deg, #456cff 0%, #3758f9 100%)';
        const defaultShadow = 'inset 0 1px 0 rgba(255, 255, 255, 0.28), 0 1px 2px rgba(0, 0, 0, 0.06), 0 4px 12px rgba(55, 88, 249, 0.32)';
        const defaultHoverShadow = 'inset 0 1px 0 rgba(255, 255, 255, 0.28), 0 2px 4px rgba(0, 0, 0, 0.08), 0 6px 16px rgba(55, 88, 249, 0.45)';
        const defaultBorder = '1px solid rgba(55, 88, 249, 0.75)';
        const defaultColor = '#ffffff';

        root.style.setProperty('--btn-primary-bg', defaultBgGrad);
        root.style.setProperty('--brand-gradient', defaultBgGrad);
        root.style.setProperty('--btn-primary-hover-bg', defaultBgHover);
        root.style.setProperty('--brand-gradient-hover', defaultBgHover);
        root.style.setProperty('--btn-primary-shadow', defaultShadow);
        root.style.setProperty('--btn-primary-hover-shadow', defaultHoverShadow);
        root.style.setProperty('--btn-primary-border', defaultBorder);
        root.style.setProperty('--btn-primary-color', defaultColor);

        // Direct override from Builcolor custom palette ONLY when tab-default ("De Studio Gốc") is active
        try {
          const customPaletteRaw = localStorage.getItem('de_studio_active_brand_palette');
          if (customPaletteRaw) {
            const pal = JSON.parse(customPaletteRaw);
            if (pal && pal.shades) {
              Object.keys(pal.shades).forEach(scale => {
                const val = isDark ? (pal.shades[scale].dark || pal.shades[scale].light) : pal.shades[scale].light;
                if (val) root.style.setProperty(`--ds-brand-${scale}`, val);
              });
              const s1000 = isDark ? (pal.shades['1000']?.dark || pal.shades['1000']?.light) : pal.shades['1000']?.light;
              const s1100 = isDark ? (pal.shades['1100']?.dark || pal.shades['1100']?.light) : pal.shades['1100']?.light;
              const s50 = isDark ? (pal.shades['50']?.dark || pal.shades['50']?.light) : pal.shades['50']?.light;
              const s200 = isDark ? (pal.shades['200']?.dark || pal.shades['200']?.light) : pal.shades['200']?.light;
              const sRing = isDark ? (pal.shades['ring']?.dark || pal.shades['ring']?.light) : pal.shades['ring']?.light;
              if (s1000) {
                root.style.setProperty('--brand-primary', isDark ? (pal.shades['1000']?.light || s1000) : s1000);
                root.style.setProperty('--brand-link', s1000);
              }
              if (s1100) root.style.setProperty('--brand-primary-hover', s1100);
              if (s50) root.style.setProperty('--brand-soft', s50);
              if (s200) root.style.setProperty('--brand-border', s200);
              if (sRing) root.style.setProperty('--brand-focus-ring', sRing);
            }

            // Direct override for neutral / grey scale from Builcolor if present
            if (pal && pal.neutralShades) {
              Object.keys(pal.neutralShades).forEach(scale => {
                const val = isDark ? (pal.neutralShades[scale].dark || pal.neutralShades[scale].light) : pal.neutralShades[scale].light;
                if (val) root.style.setProperty(`--ds-grey-${scale}`, val);
              });
              const g25 = isDark ? (pal.neutralShades['25']?.dark || '#090d16') : (pal.neutralShades['25']?.light || '#ffffff');
              const g50 = isDark ? (pal.neutralShades['50']?.dark || '#0f172a') : (pal.neutralShades['50']?.light || '#f8fafc');
              const g100 = isDark ? (pal.neutralShades['100']?.dark || '#1e293b') : (pal.neutralShades['100']?.light || '#f1f5f9');
              const g200 = isDark ? (pal.neutralShades['200']?.dark || '#334155') : (pal.neutralShades['200']?.light || '#e2e8f0');
              const g300 = isDark ? (pal.neutralShades['300']?.dark || '#475569') : (pal.neutralShades['300']?.light || '#cbd5e1');
              const g700 = isDark ? (pal.neutralShades['700']?.dark || '#cbd5e1') : (pal.neutralShades['700']?.light || '#475569');
              const g1000 = isDark ? (pal.neutralShades['1000']?.dark || '#f8fafc') : (pal.neutralShades['1000']?.light || '#0f172a');
              root.style.setProperty('--bg-app', g50);
              root.style.setProperty('--bg-surface', g25);
              root.style.setProperty('--bg-subtle', g100);
              root.style.setProperty('--border-default', g200);
              root.style.setProperty('--border-strong', g300);
              root.style.setProperty('--text-primary', g1000);
              root.style.setProperty('--text-secondary', g700);
            }

            // Direct override for Primary Button Gradient from Builcolor if present
            if (pal && pal.buttonGradient) {
              const bgGrad = isDark ? (pal.buttonGradient.dark || pal.buttonGradient.light || pal.buttonGradient.cssGradient) : (pal.buttonGradient.light || pal.buttonGradient.cssGradient);
              const bgHover = isDark ? (pal.buttonGradient.darkHover || pal.buttonGradient.lightHover || pal.buttonGradient.cssHover) : (pal.buttonGradient.lightHover || pal.buttonGradient.cssHover);
              const shadow = isDark ? (pal.buttonGradient.darkShadow || pal.buttonGradient.lightShadow || pal.buttonGradient.shadow) : (pal.buttonGradient.lightShadow || pal.buttonGradient.shadow);
              const hoverShadow = isDark ? (pal.buttonGradient.darkHoverShadow || pal.buttonGradient.lightHoverShadow || pal.buttonGradient.hoverShadow) : (pal.buttonGradient.lightHoverShadow || pal.buttonGradient.hoverShadow);
              const border = isDark ? (pal.buttonGradient.darkBorder || pal.buttonGradient.lightBorder || pal.buttonGradient.border) : (pal.buttonGradient.lightBorder || pal.buttonGradient.border);
              const txt = isDark ? (pal.buttonGradient.darkText || pal.buttonGradient.color || '#ffffff') : (pal.buttonGradient.lightText || pal.buttonGradient.color || '#ffffff');
              if (bgGrad) {
                root.style.setProperty('--btn-primary-bg', bgGrad);
                root.style.setProperty('--brand-gradient', bgGrad);
              }
              if (bgHover) root.style.setProperty('--btn-primary-hover-bg', bgHover);
              if (shadow) root.style.setProperty('--btn-primary-shadow', shadow);
              if (hoverShadow) root.style.setProperty('--btn-primary-hover-shadow', hoverShadow);
              if (border) root.style.setProperty('--btn-primary-border', border);
              if (txt) root.style.setProperty('--btn-primary-color', txt);
            }

            // Direct override for 6 System Color groups from Builcolor if present
            if (pal && pal.systemShades && typeof pal.systemShades === 'object') {
              ['red', 'amber', 'green', 'teal', 'orange', 'purple'].forEach(sysId => {
                const sysMap = pal.systemShades[sysId];
                if (sysMap && typeof sysMap === 'object') {
                  Object.keys(sysMap).forEach(scale => {
                    const val = isDark ? (sysMap[scale].dark || sysMap[scale].light) : sysMap[scale].light;
                    if (val) root.style.setProperty(`--ds-${sysId}-${scale}`, val);
                  });
                }
              });
            }
          }
        } catch (e) {}

        // Standalone System Colors Palette from localStorage if saved directly (ONLY for tab-default)
        try {
          const customSysRaw = localStorage.getItem('de_studio_active_system_palette');
          if (customSysRaw) {
            const spal = JSON.parse(customSysRaw);
            if (spal && spal.shades && typeof spal.shades === 'object') {
              ['red', 'amber', 'green', 'teal', 'orange', 'purple'].forEach(sysId => {
                const sysMap = spal.shades[sysId];
                if (sysMap && typeof sysMap === 'object') {
                  Object.keys(sysMap).forEach(scale => {
                    const val = isDark ? (sysMap[scale].dark || sysMap[scale].light) : sysMap[scale].light;
                    if (val) root.style.setProperty(`--ds-${sysId}-${scale}`, val);
                  });
                }
              });
            }
          }
        } catch (e) {}

        // Standalone Neutral / Background Palette from localStorage if saved directly (ONLY for tab-default)
        try {
          const customNeutralRaw = localStorage.getItem('de_studio_active_neutral_palette');
          if (customNeutralRaw) {
            const npal = JSON.parse(customNeutralRaw);
            if (npal && npal.shades) {
              Object.keys(npal.shades).forEach(scale => {
                const val = isDark ? (npal.shades[scale].dark || npal.shades[scale].light) : npal.shades[scale].light;
                if (val) root.style.setProperty(`--ds-grey-${scale}`, val);
              });
              const g25 = isDark ? (npal.shades['25']?.dark || '#090d16') : (npal.shades['25']?.light || '#ffffff');
              const g50 = isDark ? (npal.shades['50']?.dark || '#0f172a') : (npal.shades['50']?.light || '#f8fafc');
              const g100 = isDark ? (npal.shades['100']?.dark || '#1e293b') : (npal.shades['100']?.light || '#f1f5f9');
              const g200 = isDark ? (npal.shades['200']?.dark || '#334155') : (npal.shades['200']?.light || '#e2e8f0');
              const g300 = isDark ? (npal.shades['300']?.dark || '#475569') : (npal.shades['300']?.light || '#cbd5e1');
              const g700 = isDark ? (npal.shades['700']?.dark || '#cbd5e1') : (npal.shades['700']?.light || '#475569');
              const g1000 = isDark ? (npal.shades['1000']?.dark || '#f8fafc') : (npal.shades['1000']?.light || '#0f172a');
              root.style.setProperty('--bg-app', g50);
              root.style.setProperty('--bg-surface', g25);
              root.style.setProperty('--bg-subtle', g100);
              root.style.setProperty('--border-default', g200);
              root.style.setProperty('--border-strong', g300);
              root.style.setProperty('--text-primary', g1000);
              root.style.setProperty('--text-secondary', g700);
            }
          }
        } catch (e) {}

        // Standalone Button Gradient from localStorage if saved directly (ONLY for tab-default)
        try {
          const customGradientRaw = localStorage.getItem('de_studio_active_button_gradient');
          if (customGradientRaw) {
            const grad = JSON.parse(customGradientRaw);
            if (grad) {
              const bgGrad = isDark ? (grad.dark || grad.light || grad.cssGradient) : (grad.light || grad.cssGradient);
              const bgHover = isDark ? (grad.darkHover || grad.lightHover || grad.cssHover) : (grad.lightHover || grad.cssHover);
              const shadow = isDark ? (grad.darkShadow || grad.lightShadow || grad.shadow) : (grad.lightShadow || grad.shadow);
              const hoverShadow = isDark ? (grad.darkHoverShadow || grad.lightHoverShadow || grad.hoverShadow) : (grad.lightHoverShadow || grad.hoverShadow);
              const border = isDark ? (grad.darkBorder || grad.lightBorder || grad.border) : (grad.lightBorder || grad.border);
              const txt = isDark ? (grad.darkText || grad.color || '#ffffff') : (grad.lightText || grad.color || '#ffffff');
              if (bgGrad) {
                root.style.setProperty('--btn-primary-bg', bgGrad);
                root.style.setProperty('--brand-gradient', bgGrad);
              }
              if (bgHover) root.style.setProperty('--btn-primary-hover-bg', bgHover);
              if (shadow) root.style.setProperty('--btn-primary-shadow', shadow);
              if (hoverShadow) root.style.setProperty('--btn-primary-hover-shadow', hoverShadow);
              if (border) root.style.setProperty('--btn-primary-border', border);
              if (txt) root.style.setProperty('--btn-primary-color', txt);
            }
          }
        } catch (e) {}
      } else {
        // Strict isolation: The 3 OKLCH Enterprise Tabs (Enterprise Trust, Modern Product & AI, Data & Observability)
        // must NOT use button gradient. They strictly use their respective tab's flat solid brand color and standard shadow!
        const solidBrand = ctaBrand || '#2563eb';
        const solidHover = hoverVal || solidBrand;
        const solidShadow = 'var(--ds-shadow-xs, 0 1px 2px rgba(16, 24, 40, 0.05))';
        const solidHoverShadow = 'var(--ds-shadow-sm, 0 2px 4px rgba(16, 24, 40, 0.08))';
        const solidBorder = '1px solid transparent';
        const solidColor = '#ffffff';

        root.style.setProperty('--btn-primary-bg', solidBrand);
        root.style.setProperty('--brand-gradient', solidBrand);
        root.style.setProperty('--btn-primary-hover-bg', solidHover);
        root.style.setProperty('--brand-gradient-hover', solidHover);
        root.style.setProperty('--btn-primary-shadow', solidShadow);
        root.style.setProperty('--btn-primary-hover-shadow', solidHoverShadow);
        root.style.setProperty('--btn-primary-border', solidBorder);
        root.style.setProperty('--btn-primary-color', solidColor);

        // Strict isolation for backgrounds & surfaces:
        // Always derive strictly from the active Enterprise Archetype's own pristine grey scale (Slate / Zinc / Cool Gray)
        // Any custom neutral / background palette from Builcolor MUST NEVER touch or pollute these tabs!
        const entG25 = getScale('grey', '25') || (isDark ? '#020617' : '#ffffff');
        const entG50 = getScale('grey', '50') || (isDark ? '#0f172a' : '#f8fafc');
        const entG100 = getScale('grey', '100') || (isDark ? '#1e293b' : '#f1f5f9');
        const entG200 = getScale('grey', '200') || (isDark ? '#334155' : '#e2e8f0');
        const entG300 = getScale('grey', '300') || (isDark ? '#475569' : '#cbd5e1');
        const entG700 = getScale('grey', '700') || (isDark ? '#94a3b8' : '#64748b');
        const entG1000 = getScale('grey', '1000') || (isDark ? '#f8fafc' : '#0f172a');

        root.style.setProperty('--bg-app', entG50);
        root.style.setProperty('--bg-surface', entG25);
        root.style.setProperty('--bg-subtle', entG100);
        root.style.setProperty('--border-default', entG200);
        root.style.setProperty('--border-strong', entG300);
        root.style.setProperty('--text-primary', entG1000);
        root.style.setProperty('--text-secondary', entG700);
      }
      if (getScale('green', '1000')) root.style.setProperty('--code-green', getScale('green', '1000'));
      if (getScale('green', '50')) root.style.setProperty('--code-green-bg', getScale('green', '50'));

      const brand1000 = ctaBrand || '#2563eb';
      const brand1100 = hoverVal || brand1000;
      const brand50 = getScale('brand', '50') || (isDark ? '#172554' : '#eff6ff');
      root.style.setProperty('--ai-gradient', `linear-gradient(135deg, ${brand1100} 0%, ${brand1000} 100%)`);
      root.style.setProperty('--ai-accent', brandMode || brand1000);
      root.style.setProperty('--ai-soft', brand50);
      root.style.setProperty('--ds-orange-text', isDark ? (getScale('orange', '1000', 'dark') || '#fdba74') : (getScale('orange', '800', 'light') || getScale('orange', '1000', 'light') || '#9a3412'));
      root.style.setProperty('--ds-orange-solid', getScale('orange', '800', 'light') || '#c2410c');
      root.style.setProperty('--ds-amber-text', isDark ? (getScale('amber', '1000', 'dark') || '#f59e0b') : (getScale('amber', '1000', 'light') || '#b45309'));
      root.style.setProperty('--ds-green-text', isDark ? (getScale('green', '1000', 'dark') || '#34d399') : (getScale('green', '1000', 'light') || '#065f46'));
      root.style.setProperty('--ds-red-text', isDark ? (getScale('red', '1000', 'dark') || '#f87171') : (getScale('red', '1000', 'light') || '#991b1b'));

      root.style.setProperty('--status-success-bg', getScale('green', '50') || (isDark ? '#022c22' : '#ecfdf5'));
      root.style.setProperty('--status-success-text', getScale('green', '1000') || (isDark ? '#10b981' : '#047857'));
      root.style.setProperty('--status-warning-bg', getScale('amber', '50') || (isDark ? '#451a03' : '#fffbeb'));
      root.style.setProperty('--status-warning-text', getScale('amber', '1000') || (isDark ? '#f59e0b' : '#b45309'));
      root.style.setProperty('--status-danger-bg', getScale('red', '50') || (isDark ? '#450a0a' : '#fef2f2'));
      root.style.setProperty('--status-danger-text', getScale('red', '1000') || (isDark ? '#f87171' : '#b91c1c'));
      root.style.setProperty('--status-info-bg', getScale('teal', '50') || (isDark ? '#082f49' : '#f0f9ff'));
      root.style.setProperty('--status-info-text', getScale('teal', '1000') || (isDark ? '#0ea5e9' : '#0369a1'));
      root.style.setProperty('--chart-grid', isDark ? '#1e293b' : '#eaecf0');
      root.style.setProperty('--chart-track', isDark ? '#1e293b' : '#f2f4f7');
      root.style.setProperty('--chart-bar-primary', isDark ? (brandMode || '#60a5fa') : (ctaBrand || '#004eeb'));
      root.style.setProperty('--chart-bar-muted', isDark ? (ctaBrand || '#2563eb') : '#c7d7fe');
      root.style.setProperty('--map-land', isDark ? '#283548' : '#f1f5f9');
      root.style.setProperty('--map-stroke', isDark ? '#475569' : '#ffffff');
      root.style.setProperty('--map-land-warm', isDark ? '#7c2d12' : '#fed7aa');
      root.style.setProperty('--map-land-mid', isDark ? '#c2410c' : '#fb923c');

      // Semantic canvas alias, hover/active and faint text aliases
      root.style.setProperty('--bg-canvas', root.style.getPropertyValue('--bg-app') || (isDark ? '#020617' : '#f8fafc'));
      root.style.setProperty('--text-muted', isDark ? (getScale('grey', '800', 'dark') || '#94a3b8') : (getScale('grey', '700', 'light') || '#64748b'));
      root.style.setProperty('--text-faint', isDark ? '#64748b' : (getScale('grey', '500', 'light') || '#94a3b8'));
      root.style.setProperty('--bg-hover', isDark ? (getScale('grey', '100', 'dark') || '#1e293b') : (getScale('grey', '100', 'light') || '#f1f5f9'));
      root.style.setProperty('--bg-active', isDark ? (getScale('grey', '200', 'dark') || '#334155') : (getScale('grey', '200', 'light') || '#e2e8f0'));
    }

    function buildColorCSSTokens(tabObj) {
      const tab = tabObj || (typeof getViewingColorTab === 'function' ? getViewingColorTab() : null);
      const groups = tab && Array.isArray(tab.groups) ? tab.groups : colorGroups;
      let lightVars = '';
      let darkVars = '';
      groups.forEach(group => {
        group.rows.forEach(row => {
          lightVars += `  --ds-${group.id}-${row.scale}: ${row.light};\n`;
          darkVars += `  --ds-${group.id}-${row.scale}: ${row.dark};\n`;
        });
      });
      if (tab && tab.kind === 'enterprise') {
        const arch = (typeof ENTERPRISE_ARCHETYPES !== 'undefined' && typeof colorTabsState !== 'undefined')
          ? (ENTERPRISE_ARCHETYPES.find(a => a.id === (tab.archetypeId || colorTabsState.enterpriseArchetype)) || ENTERPRISE_ARCHETYPES[0])
          : null;
        const vizList = (typeof ENTERPRISE_VIZ_PALETTES !== 'undefined' && typeof colorTabsState !== 'undefined')
          ? (ENTERPRISE_VIZ_PALETTES[colorTabsState.vizPaletteMode] || ENTERPRISE_VIZ_PALETTES.enterprise)
          : [];
        const semanticLight = `  /* Semantic Layer (60-30-10 Enterprise SaaS) */\n  --bg-canvas: var(--ds-grey-50);\n  --bg-surface: var(--ds-grey-25);\n  --bg-surface-elevated: var(--ds-grey-25);\n  --text-primary: var(--ds-grey-1000);\n  --text-secondary: var(--ds-grey-700);\n  --action-primary-bg: var(--ds-brand-1000);\n  --border-subtle: var(--ds-grey-200);\n`;
        const semanticDark = `  /* Semantic Layer (12-Step Functional Dark Elevation) */\n  --bg-canvas: var(--ds-grey-25);\n  --bg-surface: var(--ds-grey-50);\n  --bg-surface-elevated: var(--ds-grey-100);\n  --text-primary: var(--ds-grey-1000);\n  --text-secondary: var(--ds-grey-700);\n  --action-primary-bg: var(--ds-brand-1000);\n  --border-subtle: var(--ds-grey-200);\n`;
        const vizCss = vizList.map((v, i) => `  --viz-${i + 1}: ${v.hex};`).join('\n');
        const vizOklchCss = vizList.map((v, i) => `    --viz-${i + 1}: ${v.oklch};`).join('\n');
        const brandOklch = arch ? `    --action-primary-bg: ${arch.brandOklch};\n` : '';
        return `:root {\n${lightVars}${semanticLight}${vizCss ? vizCss + '\n' : ''}}\n\n[data-theme="dark"] {\n${darkVars}${semanticDark}}\n\n@supports (color: oklch(0% 0 0)) {\n  :root {\n${brandOklch}${vizOklchCss}\n  }\n}`;
      }
      return `:root {\n${lightVars}}\n\n[data-theme="dark"] {\n${darkVars}}`;
    }

    // =========================================================================
    // 2B. TYPOGRAPHY SCALE DATA MODEL & EDITOR
    // =========================================================================
    const TYPO_STORAGE_KEY = 'de_studio_typography_v1';

    const DEFAULT_TYPOGRAPHY_STATE = {
      fontFamily: 'Inter',
      sampleMode: 'en-name', // 'en-name' | 'vi-sample'
      scales: [
        { id: 'display-2xl', name: 'Display 2xl', sizePx: 72, linePx: 90, spacingPct: -2, usage: 'Tiêu đề Hero trang chủ / Marketing banner cỡ đại.' },
        { id: 'display-xl',  name: 'Display xl',  sizePx: 60, linePx: 72, spacingPct: -2, usage: 'Tiêu đề Landing section chính, số liệu nổi bật.' },
        { id: 'display-lg',  name: 'Display lg',  sizePx: 48, linePx: 60, spacingPct: -2, usage: 'Tiêu đề trang giới thiệu tính năng lớn.' },
        { id: 'display-md',  name: 'Display md',  sizePx: 36, linePx: 44, spacingPct: -2, usage: 'Tiêu đề màn hình Empty state hoặc Onboarding lớn.' },
        { id: 'display-sm',  name: 'Display sm',  sizePx: 30, linePx: 38, spacingPct: 0,  usage: 'Tiêu đề trang Dashboard chính hoặc thống kê KPI.' },
        { id: 'display-xs',  name: 'Display xs',  sizePx: 24, linePx: 32, spacingPct: 0,  usage: 'Tiêu đề Modal lớn, tên Workspace hoặc Section header.' },
        { id: 'text-xl',     name: 'Text xl',     sizePx: 20, linePx: 30, spacingPct: 0,  usage: 'Tiêu đề card quan trọng, sub-heading trang cài đặt.' },
        { id: 'text-lg',     name: 'Text lg',     sizePx: 18, linePx: 28, spacingPct: 0,  usage: 'Tiêu đề hộp thoại (Modal), tiêu đề nhóm nội dung.' },
        { id: 'text-md',     name: 'Text md',     sizePx: 16, linePx: 24, spacingPct: 0,  usage: 'Văn bản nội dung tiêu chuẩn, đoạn mô tả chính.' },
        { id: 'text-sm',     name: 'Text sm',     labelMeta: 'Text small', sizePx: 14, linePx: 20, spacingPct: 0, usage: 'Chữ UI chuẩn trong SaaS: bảng dữ liệu, nút bấm, form input.' },
        { id: 'text-xs',     name: 'Text xs',     sizePx: 12, linePx: 18, spacingPct: 0,  usage: 'Nhãn phụ (caption), gợi ý form (helper text), badge.' },
        { id: 'text-xxs',    name: 'Text xxs',    sizePx: 10, linePx: 16, spacingPct: 0,  usage: 'Nhãn siêu nhỏ, chỉ số đếm thông báo, watermark kỹ thuật.' }
      ]
    };

    const TYPO_WEIGHTS = [
      { label: 'Regular',  viLabel: 'Thường',   weight: 400 },
      { label: 'Medium',   viLabel: 'Vừa',      weight: 500 },
      { label: 'Semibold', viLabel: 'Bán đậm',  weight: 600 },
      { label: 'Bold',     viLabel: 'Đậm',      weight: 700 }
    ];

    function loadTypographyState() {
      const base = JSON.parse(JSON.stringify(DEFAULT_TYPOGRAPHY_STATE));
      try {
        const saved = localStorage.getItem(TYPO_STORAGE_KEY);
        if (!saved) return base;
        const parsed = JSON.parse(saved);
        if (parsed.fontFamily) base.fontFamily = parsed.fontFamily;
        if (parsed.sampleMode) base.sampleMode = parsed.sampleMode;
        if (Array.isArray(parsed.scales)) {
          base.scales = base.scales.map(def => {
            const ov = parsed.scales.find(s => s.id === def.id);
            return ov ? { ...def, ...ov } : def;
          });
        }
      } catch (e) {}
      return base;
    }

    let typoState = loadTypographyState();
    let editingTypoId = null;

    function syncTypographyToCSS() {
      const root = document.documentElement;
      const stack = `"${typoState.fontFamily}", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`;
      root.style.setProperty('--ds-font-sans', stack);
      root.style.setProperty('--font-sans', stack);
      typoState.scales.forEach(s => {
        root.style.setProperty(`--ds-${s.id}-size`, `${pxToRem(s.sizePx)}rem`);
        root.style.setProperty(`--ds-${s.id}-line`, `${pxToRem(s.linePx)}rem`);
        root.style.setProperty(`--ds-${s.id}-spacing`, s.spacingPct !== 0 ? `${s.spacingPct / 100}em` : '0');
      });
    }

    function saveTypographyState() {
      try {
        localStorage.setItem(TYPO_STORAGE_KEY, JSON.stringify(typoState));
      } catch (e) {}
      syncTypographyToCSS();
    }

    function pxToRem(px) {
      return Math.round((px / 16) * 1000) / 1000;
    }

    function countCustomizedTypo() {
      let count = typoState.fontFamily !== DEFAULT_TYPOGRAPHY_STATE.fontFamily ? 1 : 0;
      DEFAULT_TYPOGRAPHY_STATE.scales.forEach((def, idx) => {
        const cur = typoState.scales[idx];
        if (cur.sizePx !== def.sizePx || cur.linePx !== def.linePx || cur.spacingPct !== def.spacingPct || cur.usage !== def.usage) {
          count++;
        }
      });
      return count;
    }

    function buildTypographyCSSTokens() {
      let vars = `  --ds-font-sans: "${typoState.fontFamily}", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\n`;
      let classes = '';
      typoState.scales.forEach(s => {
        const sizeRem = pxToRem(s.sizePx);
        const lineRem = pxToRem(s.linePx);
        const ls = s.spacingPct !== 0 ? `${s.spacingPct / 100}em` : '0';
        vars += `  --ds-${s.id}-size: ${sizeRem}rem; /* ${s.sizePx}px */\n`;
        vars += `  --ds-${s.id}-line: ${lineRem}rem; /* ${s.linePx}px */\n`;
        classes += `.ds-${s.id} {\n  font-family: var(--ds-font-sans);\n  font-size: var(--ds-${s.id}-size);\n  line-height: var(--ds-${s.id}-line);\n  letter-spacing: ${ls};\n}\n\n`;
      });
      return `:root {\n${vars}}\n\n${classes.trim()}`;
    }

    function onTypoFontFamilyChange(val) {
      typoState.fontFamily = val.trim() || 'Inter';
      saveTypographyState();
      renderCanvas();
      showToast(`Đã chuyển font chữ sang "${typoState.fontFamily}"`);
    }

    function toggleTypoSampleMode(mode) {
      typoState.sampleMode = mode;
      saveTypographyState();
      renderCanvas();
    }

    function renderTypographyPage() {
      const customCount = countCustomizedTypo();
      const fontStack = `"${typoState.fontFamily}", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;

      const scaleRowsHtml = typoState.scales.map(s => {
        const sizeRem = pxToRem(s.sizePx);
        const lineRem = pxToRem(s.linePx);
        const lsCss = s.spacingPct !== 0 ? `${s.spacingPct / 100}em` : 'normal';
        const lsLabel = s.spacingPct !== 0 ? ` | Giãn chữ: ${s.spacingPct}%` : '';

        return `
          <div class="typo-scale-row">
            <div class="typo-row-meta">
              <div class="typo-row-title-wrap">
                <span class="typo-row-name">${s.labelMeta || s.name}</span>
                <span style="font-size:11px; color:var(--text-muted);">— ${s.usage}</span>
              </div>
              <div class="typo-row-specs">
                <span>Cỡ chữ: ${s.sizePx}px / ${sizeRem}rem | Chiều cao dòng: ${s.linePx}px / ${lineRem}rem${lsLabel}</span>
                <button type="button" class="typo-edit-pill" onclick="openTypoEditor('${s.id}')">✎ Chỉnh sửa</button>
              </div>
            </div>
            <div class="typo-weights-grid" style="font-family:${fontStack};">
              ${TYPO_WEIGHTS.map(w => {
                const sampleMain = typoState.sampleMode === 'vi-sample'
                  ? (s.sizePx >= 36 ? 'Thiết kế SaaS' : 'Giao diện chuẩn hệ thống')
                  : s.name;
                const cssRule = `font-family: ${fontStack}; font-size: ${s.sizePx}px; line-height: ${s.linePx}px; font-weight: ${w.weight}; letter-spacing: ${lsCss};`;
                return `
                  <div class="typo-weight-cell" onclick="copyText('${cssRule.replace(/"/g, '\\"')}')" title="Click để copy CSS của ${s.name} ${w.label}">
                    <div class="typo-sample-line" style="font-size:${s.sizePx}px; line-height:${s.linePx}px; font-weight:${w.weight}; letter-spacing:${lsCss};">
                      <div>${sampleMain}</div>
                      <div>${w.label}</div>
                    </div>
                    <div class="typo-weight-caption">${w.viLabel} (${w.weight}) • Click copy CSS</div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `;
      }).join('');

      return `
        <div class="colors-toolbar-bar">
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            <span class="ds-badge ds-badge-blue">Thang chữ chuẩn SaaS (12 bậc)</span>
            <span style="font-size:12px; color:var(--text-secondary);">
              Click <strong>Chỉnh sửa</strong> ở từng bậc để đổi kích thước, hoặc click vào chữ để <strong>Copy CSS</strong>.
              ${customCount > 0 ? `<b style="color:var(--brand-primary);">(${customCount} mục đã tùy chỉnh)</b>` : ''}
            </span>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            ${customCount > 0 ? `<button class="btn-ds" onclick="resetAllTypography()">↺ Khôi phục mặc định</button>` : ''}
            <button class="btn-ds" onclick="copyText(buildTypographyCSSTokens())">Copy CSS Tokens</button>
          </div>
        </div>

        <div class="typo-sheet">
          <!-- Header -->
          <div class="typo-header-block">
            <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.05em;">NỀN TẢNG • FOUNDATIONS / TYPOGRAPHY</div>
            <h1 style="font-size:24px; font-weight:700; color:var(--text-primary); margin-top:4px; letter-spacing:-0.02em;">Hệ thống Kiểu chữ (Typography)</h1>
            <p style="font-size:13px; color:var(--text-secondary); max-width:760px; margin-top:8px; line-height:1.6;">
              Hệ thống thiết kế sử dụng bộ kiểu chữ có chủ đích và nhất quán. Thang kích thước chữ này đã được kiểm nghiệm thực tế trên nhiều dự án SaaS để đảm bảo đủ mạnh mẽ cho mọi màn hình, đồng thời duy trì độ dễ đọc và khả năng tiếp cận (Accessibility) tốt nhất cho mọi người dùng.
            </p>

            <div class="colors-principles-grid">
              <div class="principle-card">
                <div class="principle-card-title">1. Display vs Text</div>
                <div class="principle-card-desc"><b>Display (2xl–xs)</b> dùng cho tiêu đề Hero, tiêu đề trang &amp; số liệu lớn; <b>Text (xl–xxs)</b> dùng cho nội dung, bảng, form &amp; nút.</div>
              </div>
              <div class="principle-card">
                <div class="principle-card-title">2. Tối đa 4 độ đậm</div>
                <div class="principle-card-desc">Chỉ dùng 4 mức: <b>Regular (400)</b> cho đoạn văn, <b>Medium (500)</b> cho nhãn/link, <b>Semibold (600)</b> cho tiêu đề nhỏ, <b>Bold (700)</b> cho nhấn mạnh.</div>
              </div>
              <div class="principle-card">
                <div class="principle-card-title">3. Chuẩn dấu Tiếng Việt</div>
                <div class="principle-card-desc">Chiều cao dòng (Line-height) tối thiểu 1.25x–1.5x cỡ chữ để dấu thanh Tiếng Việt không bị dính hoặc cắt xén.</div>
              </div>
            </div>
          </div>

          <!-- Font Family Specimen -->
          <div class="typo-specimen-block" style="font-family:${fontStack};">
            <div style="flex:1; min-width:260px;">
              <div class="typo-font-name">${typoState.fontFamily}</div>
              <div class="typo-ag-glyph">Ag</div>
              <div class="typo-charset">
                <div>ABCDEFGHIJKLMNOPQRSTUVWXYZ</div>
                <div>abcdefghijklmnopqrstuvwxyz</div>
                <div>0123456789 !@#$%^&amp;*()</div>
                <div style="margin-top:6px; color:var(--text-muted); font-size:13px;">Mẫu dấu Tiếng Việt: Ă Â Đ Ê Ô Ơ Ư — á à ả ã ạ</div>
              </div>
            </div>

            <div class="typo-font-controls" style="font-family:var(--font-sans);">
              <div class="form-field">
                <label>Font chữ chính của hệ thống</label>
                <select class="ds-input" style="height:32px; font-size:12px;" onchange="onTypoFontFamilyChange(this.value)">
                  <option value="Inter" ${typoState.fontFamily === 'Inter' ? 'selected' : ''}>Inter (Mặc định)</option>
                  <option value="Be Vietnam Pro" ${typoState.fontFamily === 'Be Vietnam Pro' ? 'selected' : ''}>Be Vietnam Pro</option>
                  <option value="Plus Jakarta Sans" ${typoState.fontFamily === 'Plus Jakarta Sans' ? 'selected' : ''}>Plus Jakarta Sans</option>
                  <option value="Segoe UI" ${typoState.fontFamily === 'Segoe UI' ? 'selected' : ''}>Segoe UI (Windows Native)</option>
                  <option value="Roboto" ${typoState.fontFamily === 'Roboto' ? 'selected' : ''}>Roboto</option>
                </select>
              </div>
              <div class="form-field">
                <label>Chế độ hiển thị mẫu chữ</label>
                <div style="display:flex; gap:8px;">
                  <button type="button" class="filter-chip ${typoState.sampleMode === 'en-name' ? 'active' : ''}" style="flex:1; justify-content:center; padding:4px;" onclick="toggleTypoSampleMode('en-name')">Tên chuẩn (Display/Text)</button>
                  <button type="button" class="filter-chip ${typoState.sampleMode === 'vi-sample' ? 'active' : ''}" style="flex:1; justify-content:center; padding:4px;" onclick="toggleTypoSampleMode('vi-sample')">Câu Tiếng Việt</button>
                </div>
              </div>
            </div>
          </div>

          <!-- 12 Typography Scale Rows -->
          <div>${scaleRowsHtml}</div>
        </div>
      `;
    }

    function openTypoEditor(scaleId) {
      const s = typoState.scales.find(item => item.id === scaleId);
      if (!s) return;
      editingTypoId = scaleId;
      document.getElementById('teTitle').textContent = `Chỉnh sửa: ${s.name}`;
      document.getElementById('teSubtitle').textContent = `Token: --ds-${s.id}-size / --ds-${s.id}-line`;
      document.getElementById('teFontSize').value = s.sizePx;
      document.getElementById('teLineHeight').value = s.linePx;
      document.getElementById('teLetterSpacing').value = s.spacingPct;
      document.getElementById('teUsageNote').value = s.usage;
      updateTypoEditorPreview();
      document.getElementById('typoEditorModal').classList.add('open');
    }

    function updateTypoEditorPreview() {
      const size = Math.max(8, parseFloat(document.getElementById('teFontSize').value) || 14);
      const line = Math.max(10, parseFloat(document.getElementById('teLineHeight').value) || 20);
      const ls = parseFloat(document.getElementById('teLetterSpacing').value) || 0;
      document.getElementById('teFontSizeRem').textContent = `${pxToRem(size)}rem (${size}px)`;
      document.getElementById('teLineHeightRem').textContent = `${pxToRem(line)}rem (${line}px)`;

      const sample = document.getElementById('tePreviewSample');
      sample.style.fontFamily = `"${typoState.fontFamily}", sans-serif`;
      sample.style.fontSize = Math.min(size, 44) + 'px';
      sample.style.lineHeight = Math.min(line, 52) + 'px';
      sample.style.letterSpacing = ls !== 0 ? `${ls / 100}em` : 'normal';
      sample.style.fontWeight = '600';
    }

    function resetSingleTypo() {
      if (!editingTypoId) return;
      const def = DEFAULT_TYPOGRAPHY_STATE.scales.find(s => s.id === editingTypoId);
      if (!def) return;
      document.getElementById('teFontSize').value = def.sizePx;
      document.getElementById('teLineHeight').value = def.linePx;
      document.getElementById('teLetterSpacing').value = def.spacingPct;
      document.getElementById('teUsageNote').value = def.usage;
      updateTypoEditorPreview();
      showToast('Đã đặt lại thông số mặc định cho bậc này');
    }

    function saveTypoEditor() {
      if (!editingTypoId) return;
      const s = typoState.scales.find(item => item.id === editingTypoId);
      if (s) {
        s.sizePx = Math.max(8, parseFloat(document.getElementById('teFontSize').value) || s.sizePx);
        s.linePx = Math.max(10, parseFloat(document.getElementById('teLineHeight').value) || s.linePx);
        s.spacingPct = parseFloat(document.getElementById('teLetterSpacing').value) || 0;
        s.usage = document.getElementById('teUsageNote').value.trim() || s.usage;
        saveTypographyState();
        renderCanvas();
        showToast(`Đã lưu thông số ${s.name}`);
      }
      closeTypoEditor();
    }

    function resetAllTypography() {
      typoState = JSON.parse(JSON.stringify(DEFAULT_TYPOGRAPHY_STATE));
      try { localStorage.removeItem(TYPO_STORAGE_KEY); } catch (e) {}
      syncTypographyToCSS();
      renderCanvas();
      showToast('Đã khôi phục toàn bộ thang chữ mặc định');
    }

    function closeTypoEditor() {
      document.getElementById('typoEditorModal').classList.remove('open');
      editingTypoId = null;
    }

    // =========================================================================
    // 2C. BASE ICONS (FEATHER 24x24) CATALOG, NAMING & COMPONENT STATES
    // =========================================================================
    const ICONS_STORAGE_KEY = 'de_studio_icons_meta_v2';

    const ICON_CATEGORIES = [
      { id: 'all', name: 'Tất cả' },
      { id: 'hospitality', name: 'Khách sạn & Dịch vụ' },
      { id: 'arrows', name: 'Điều hướng & Mũi tên' },
      { id: 'ui_actions', name: 'Thao tác & Điều khiển UI' },
      { id: 'users_security', name: 'Người dùng & Bảo mật' },
      { id: 'media_devices', name: 'Media, Âm thanh & Thiết bị' },
      { id: 'finance_docs', name: 'Tài chính, Biểu đồ & Tài liệu' },
      { id: 'time_location', name: 'Thời gian, Bản đồ & Thời tiết' },
      { id: 'sports_awards', name: 'Thể thao, Giải thưởng & Danh hiệu' }
    ];

    const RAW_USER_ICONS = Array.isArray(window.USER_ICONS_BUNDLE) ? window.USER_ICONS_BUNDLE : [];

    function loadIconsCatalog() {
      const base = RAW_USER_ICONS.map(ic => ({
        ...ic,
        variants: ic.variants ? { ...ic.variants } : {}
      }));
      try {
        const saved = localStorage.getItem(ICONS_STORAGE_KEY);
        if (!saved) return base;
        const overrides = JSON.parse(saved);
        return base.map(ic => overrides[ic.id] ? { ...ic, ...overrides[ic.id] } : ic);
      } catch (e) {
        return base;
      }
    }

    let iconsCatalog = loadIconsCatalog();
    let iconFilterState = {
      cat: 'all',
      query: '',
      svgStyle: 'auto', // 'auto' | 'outlined' | 'filled'
      onOff: 'all',     // 'all' | 'on' | 'off'
      state: 'default', // 'default' | 'hover' | 'active' | 'disabled'
      variant: 'outline', // 'outline' | 'tint'
      size: 24,
      colorToken: 'grey', // 'grey' | 'brand' | 'red' | 'amber' | 'green' | 'teal'
      showGrid: true
    };
    let inspectingIconId = null;
    let inspectingStyleKey = 'outlined';

    function saveIconsMetaOverrides() {
      const overrides = {};
      RAW_USER_ICONS.forEach((def, idx) => {
        const cur = iconsCatalog[idx];
        if (cur && (cur.vi !== def.vi || cur.slug !== def.slug)) {
          overrides[def.id] = { vi: cur.vi, slug: cur.slug };
        }
      });
      try {
        localStorage.setItem(ICONS_STORAGE_KEY, JSON.stringify(overrides));
      } catch (e) {}
    }

    function getIconTokenColor(tokenId) {
      const group = colorGroups.find(g => g.id === tokenId);
      const row1000 = group?.rows.find(r => r.scale === '1000');
      const isDark = typeof uiTheme !== 'undefined' && uiTheme === 'dark';
      if (row1000) return isDark ? (row1000.dark || row1000.light) : row1000.light;
      return isDark ? 'rgba(248, 250, 252, 0.94)' : 'rgba(17, 24, 39, 0.94)';
    }

    function resolveIconVariantKey(iconObj, preferredStyle) {
      const variants = iconObj && iconObj.variants ? iconObj.variants : {};
      if (preferredStyle && variants[preferredStyle]) return preferredStyle;
      if (iconFilterState.svgStyle !== 'auto' && variants[iconFilterState.svgStyle]) return iconFilterState.svgStyle;
      if (variants[iconObj.defaultStyle]) return iconObj.defaultStyle;
      return variants.outlined ? 'outlined' : 'filled';
    }

    function buildIconSvgTag(iconObj, sizePx, strokeColor, styleKey, includeXmlns = false) {
      if (!iconObj) return '';
      const key = resolveIconVariantKey(iconObj, styleKey);
      const body = iconObj.variants && iconObj.variants[key] ? iconObj.variants[key].body : (iconObj.svg || '');
      const colorAttr = strokeColor && strokeColor !== 'currentColor' ? ` style="color:${strokeColor};"` : '';
      const xmlnsAttr = includeXmlns ? ' xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"' : '';
      return `<svg width="${sizePx}" height="${sizePx}" viewBox="0 0 24 24" fill="none"${xmlnsAttr}${colorAttr}>${body}</svg>`;
    }

    function setIconControl(key, value) {
      iconFilterState[key] = value;
      if (key === 'query') {
        const gridEl = document.getElementById('iconsGridContainer');
        if (gridEl) {
          gridEl.innerHTML = buildIconSectionsHTML();
          return;
        }
      }
      renderCanvas();
    }

    function toggleIconGrid() {
      iconFilterState.showGrid = !iconFilterState.showGrid;
      renderCanvas();
    }

    function copyIconById(iconId, styleKey) {
      const ic = iconsCatalog.find(i => i.id === iconId);
      if (!ic) return;
      const svgCode = buildIconSvgTag(ic, 24, 'currentColor', styleKey, true);
      copyText(svgCode, `Đã copy SVG "${ic.slug}.svg"`);
    }

    function downloadIconSVG(iconId, styleKey) {
      const ic = iconsCatalog.find(i => i.id === iconId);
      if (!ic) return;
      const resolvedKey = resolveIconVariantKey(ic, styleKey);
      const svgCode = `<?xml version="1.0" encoding="UTF-8"?>\n` + buildIconSvgTag(ic, 24, 'currentColor', resolvedKey, true);
      const blob = new Blob([svgCode], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${ic.slug}-${resolvedKey}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      showToast(`Đang tải xuống ${ic.slug}-${resolvedKey}.svg`);
    }

    function getFoundationIconSvg(keyword, size = 16, styleKey = 'outlined') {
      if (!Array.isArray(iconsCatalog) || !iconsCatalog.length) return '';
      const q = String(keyword || '').toLowerCase();
      const ic = iconsCatalog.find(i => (i.slug || '').toLowerCase().includes(q)) || iconsCatalog[0];
      return buildIconSvgTag(ic, size, 'currentColor', styleKey, false);
    }

    function buildIconSectionsHTML() {
      const q = iconFilterState.query.trim().toLowerCase();
      const filtered = iconsCatalog.filter(ic => {
        const matchCat = iconFilterState.cat === 'all' || ic.cat === iconFilterState.cat;
        const matchStyle = iconFilterState.svgStyle === 'auto' || Boolean(ic.variants && ic.variants[iconFilterState.svgStyle]);
        const matchOnOff = iconFilterState.onOff === 'all' || (ic.state || 'on') === iconFilterState.onOff;
        const matchQ = !q
          || ic.vi.toLowerCase().includes(q)
          || ic.slug.toLowerCase().includes(q)
          || (Array.isArray(ic.src) && ic.src.some(s => s.toLowerCase().includes(q)));
        return matchCat && matchStyle && matchOnOff && matchQ;
      });

      const activeColor = iconFilterState.state === 'active'
        ? getIconTokenColor('brand')
        : getIconTokenColor(iconFilterState.colorToken);

      const frameClasses = [
        'icon-24-frame',
        iconFilterState.showGrid ? 'show-grid' : '',
        iconFilterState.state !== 'default' ? `state-${iconFilterState.state}` : '',
        iconFilterState.variant === 'tint' ? 'variant-tint' : ''
      ].filter(Boolean).join(' ');

      const groupsToShow = ICON_CATEGORIES.filter(c => c.id !== 'all' && (iconFilterState.cat === 'all' || iconFilterState.cat === c.id));
      const sectionsHtml = groupsToShow.map(cat => {
        const items = filtered.filter(ic => ic.cat === cat.id);
        if (items.length === 0) return '';
        return `
          <div class="icons-section-block">
            <div class="icons-section-head">
              <div class="icons-section-title">
                <span>${cat.name}</span>
                <span class="ds-badge ds-badge-gray">${items.length}</span>
              </div>
              <span style="font-size:11px; color:var(--text-muted); font-family:var(--font-mono);">Khung 24×24px • ${items.reduce((acc, it) => acc + Object.keys(it.variants || {}).length, 0)} biến thể</span>
            </div>
            <div class="icons-grid">
              ${items.map(ic => {
                const vKey = resolveIconVariantKey(ic);
                const hasO = Boolean(ic.variants && ic.variants.outlined);
                const hasF = Boolean(ic.variants && ic.variants.filled);
                return `
                  <div class="icon-card" role="button" tabindex="0" onclick="openIconInspector('${ic.id}')" title="${escapeHTML(ic.vi)} (${ic.slug}) — Click xem chi tiết &amp; biến thể">
                    <div class="icon-card-top-badges">
                      ${ic.state === 'off' ? '<span class="icon-style-badge is-off" title="Trạng thái Tắt (Off)">OFF</span>' : ''}
                      ${hasO ? '<span class="icon-style-badge" title="Có biến thể Viền (Outlined)">O</span>' : ''}
                      ${hasF ? '<span class="icon-style-badge" title="Có biến thể Đặc (Filled)">F</span>' : ''}
                    </div>
                    <div class="${frameClasses}" style="color:${activeColor};">
                      ${buildIconSvgTag(ic, iconFilterState.size, 'currentColor', vKey)}
                    </div>
                    <div style="width:100%;">
                      <div class="icon-card-vi">${escapeHTML(ic.vi)}</div>
                      <div class="icon-card-slug">${escapeHTML(ic.slug)}</div>
                    </div>
                    <div class="icon-card-actions" onclick="event.stopPropagation()">
                      <button type="button" class="icon-mini-btn" onclick="copyIconById('${ic.id}', '${vKey}')" title="Copy mã SVG 24×24">Copy SVG</button>
                      <button type="button" class="icon-mini-btn" onclick="downloadIconSVG('${ic.id}', '${vKey}')" title="Tải về file ${ic.slug}-${vKey}.svg">Tải .svg</button>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `;
      }).join('');

      return sectionsHtml || '<div style="padding:36px; text-align:center; color:var(--text-muted);">Không tìm thấy icon nào phù hợp với bộ lọc hiện tại.</div>';
    }

    function renderIconsPage() {
      const demoIcon = iconsCatalog.find(i => i.slug === 'bell-notify') || iconsCatalog.find(i => i.slug === 'award') || iconsCatalog[0];
      const totalVariants = iconsCatalog.reduce((acc, ic) => acc + Object.keys(ic.variants || {}).length, 0);
      const totalSourceFiles = iconsCatalog.reduce((acc, ic) => acc + (Array.isArray(ic.src) ? ic.src.length : 1), 0);
      const sectionsHtml = buildIconSectionsHTML();

      return `
        <div class="colors-toolbar-bar">
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            <span class="ds-badge ds-badge-blue">${iconsCatalog.length} Icons • ${totalVariants} Biến thể (${totalSourceFiles} SVG gốc)</span>
            <span style="font-size:12px; color:var(--text-secondary);">
              Đã phân loại từ thư mục <code>icons/</code> thành <strong>8 nhóm</strong>, đặt tên chuẩn tiếng Anh + chú thích tiếng Việt. Hỗ trợ <strong>Copy SVG</strong> &amp; <strong>Tải về .svg</strong> trực tiếp.
            </span>
          </div>
          <button class="btn-ds" onclick="copyText(buildIconCSSSnippet())">Copy CSS Component</button>
        </div>

        <div class="icons-sheet">
          <!-- Intro -->
          <div class="typo-header-block">
            <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.05em;">NỀN TẢNG • FOUNDATIONS / ICONS</div>
            <h1 style="font-size:24px; font-weight:700; color:var(--text-primary); margin-top:4px; letter-spacing:-0.02em;">Thư viện Biểu tượng Hệ thống (24×24px)</h1>
            <p style="font-size:13px; color:var(--text-secondary); max-width:820px; margin-top:8px; line-height:1.6;">
              Toàn bộ <strong>${totalSourceFiles} tệp SVG</strong> từ thư mục <code>icons/</code> đã được chuẩn hóa về khung lưới <strong>24×24px</strong>, loại bỏ khung viền Component Set của Figma, gộp cặp biến thể <strong>Outlined / Filled</strong> và gắn thuộc tính <code>currentColor</code> để đổi màu tự động theo hệ thống Design Tokens.
            </p>

            <div class="colors-principles-grid">
              <div class="principle-card">
                <div class="principle-card-title">1. Chuẩn hóa khung 24×24px</div>
                <div class="principle-card-desc">Mỗi icon được căn giữa trên artboard <b>24×24px</b>, tách riêng các Component Set 72×120 thành biến thể <b>Outlined</b> &amp; <b>Filled</b> sạch sẽ.</div>
              </div>
              <div class="principle-card">
                <div class="principle-card-title">2. Tên chuẩn Dev &amp; Chú thích Việt</div>
                <div class="principle-card-desc">Mỗi biểu tượng có mã slug tiếng Anh chuẩn quốc tế (VD: <code>booking-tour</code>, <code>badge-check</code>) kèm mô tả tiếng Việt dễ tìm kiếm.</div>
              </div>
              <div class="principle-card">
                <div class="principle-card-title">3. Copy SVG &amp; Tải trực tiếp</div>
                <div class="principle-card-desc">Sao chép nhanh mã <code>&lt;svg&gt;</code> hoặc tải xuống file <code>.svg</code> ngay trên từng thẻ, hoạt động hoàn toàn offline trên trình duyệt.</div>
              </div>
            </div>
          </div>

          <!-- Figma Component Set Showcase -->
          <div class="figma-component-banner">
            <div class="figma-set-box">
              <div style="max-width:340px;">
                <div class="figma-set-label">❖ Component Set chuẩn (24×24px Frame)</div>
                <div style="font-size:12px; color:var(--text-secondary); line-height:1.45;">
                  Minh họa 5 biến thể trạng thái của Icon <b>${demoIcon ? escapeHTML(demoIcon.vi) : 'Mẫu'}</b> (<code>${demoIcon ? demoIcon.slug : ''}</code>) sử dụng token <code>currentColor</code>.
                </div>
              </div>
              <div class="figma-variants-strip">
                <div class="figma-variant-item">
                  <div class="icon-24-frame show-grid" style="color:${getIconTokenColor('grey')};">${buildIconSvgTag(demoIcon, 24)}</div>
                  <span>Default</span>
                </div>
                <div class="figma-variant-item">
                  <div class="icon-24-frame show-grid state-hover" style="color:${getIconTokenColor('grey')};">${buildIconSvgTag(demoIcon, 24)}</div>
                  <span>Hover</span>
                </div>
                <div class="figma-variant-item">
                  <div class="icon-24-frame show-grid state-active" style="color:${getIconTokenColor('brand')};">${buildIconSvgTag(demoIcon, 24)}</div>
                  <span>Active</span>
                </div>
                <div class="figma-variant-item">
                  <div class="icon-24-frame show-grid state-disabled" style="color:${getIconTokenColor('grey')};">${buildIconSvgTag(demoIcon, 24)}</div>
                  <span>Disabled</span>
                </div>
                <div class="figma-variant-item">
                  <div class="icon-24-frame show-grid variant-tint" style="color:${getIconTokenColor('brand')};">${buildIconSvgTag(demoIcon, 24)}</div>
                  <span>Tinted</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Filter & State Controls -->
          <div class="icons-controls-bar">
            <div class="icons-controls-top">
              <div class="icons-filter-pills">
                ${ICON_CATEGORIES.map(c => {
                  const cnt = c.id === 'all' ? iconsCatalog.length : iconsCatalog.filter(x => x.cat === c.id).length;
                  return `<button type="button" class="icon-cat-pill ${iconFilterState.cat === c.id ? 'active' : ''}" onclick="setIconControl('cat', '${c.id}')">${c.name} (${cnt})</button>`;
                }).join('')}
              </div>
              <div style="width:260px;">
                <input type="text" class="ds-input" style="height:32px; font-size:12px;" placeholder="Tìm tên Việt, English slug, tên file..." value="${escapeHTML(iconFilterState.query)}" oninput="setIconControl('query', this.value)" />
              </div>
            </div>

            <div class="icons-state-bar">
              <div class="state-group">
                <span>Kiểu nét:</span>
                <div class="seg-control">
                  <button type="button" class="seg-btn ${iconFilterState.svgStyle === 'auto' ? 'active' : ''}" onclick="setIconControl('svgStyle', 'auto')">Tất cả</button>
                  <button type="button" class="seg-btn ${iconFilterState.svgStyle === 'outlined' ? 'active' : ''}" onclick="setIconControl('svgStyle', 'outlined')">Outlined (Viền)</button>
                  <button type="button" class="seg-btn ${iconFilterState.svgStyle === 'filled' ? 'active' : ''}" onclick="setIconControl('svgStyle', 'filled')">Filled (Đặc)</button>
                </div>
              </div>

              <div class="state-group">
                <span>Bật / Tắt:</span>
                <div class="seg-control">
                  <button type="button" class="seg-btn ${iconFilterState.onOff === 'all' ? 'active' : ''}" onclick="setIconControl('onOff', 'all')">Tất cả</button>
                  <button type="button" class="seg-btn ${iconFilterState.onOff === 'on' ? 'active' : ''}" onclick="setIconControl('onOff', 'on')">Active</button>
                  <button type="button" class="seg-btn ${iconFilterState.onOff === 'off' ? 'active' : ''}" onclick="setIconControl('onOff', 'off')">Off (Gạch chéo)</button>
                </div>
              </div>

              <div class="state-group">
                <span>Trạng thái:</span>
                <div class="seg-control">
                  <button type="button" class="seg-btn ${iconFilterState.state === 'default' ? 'active' : ''}" onclick="setIconControl('state', 'default')">Default</button>
                  <button type="button" class="seg-btn ${iconFilterState.state === 'hover' ? 'active' : ''}" onclick="setIconControl('state', 'hover')">Hover</button>
                  <button type="button" class="seg-btn ${iconFilterState.state === 'active' ? 'active' : ''}" onclick="setIconControl('state', 'active')">Active</button>
                  <button type="button" class="seg-btn ${iconFilterState.state === 'disabled' ? 'active' : ''}" onclick="setIconControl('state', 'disabled')">Disabled</button>
                </div>
              </div>

              <div class="state-group">
                <span>Kích thước:</span>
                <div class="seg-control">
                  ${[16, 20, 24, 32].map(sz => `
                    <button type="button" class="seg-btn ${iconFilterState.size === sz ? 'active' : ''}" onclick="setIconControl('size', ${sz})">${sz}px</button>
                  `).join('')}
                </div>
              </div>

              <div class="state-group">
                <span>Màu Token:</span>
                <select class="ds-input" style="width:auto; height:28px; font-size:11.5px; padding:0 8px;" onchange="setIconControl('colorToken', this.value)">
                  <option value="grey" ${iconFilterState.colorToken === 'grey' ? 'selected' : ''}>Grey 1000</option>
                  <option value="brand" ${iconFilterState.colorToken === 'brand' ? 'selected' : ''}>Brand 1000</option>
                  <option value="red" ${iconFilterState.colorToken === 'red' ? 'selected' : ''}>Red 1000</option>
                  <option value="amber" ${iconFilterState.colorToken === 'amber' ? 'selected' : ''}>Amber 1000</option>
                  <option value="green" ${iconFilterState.colorToken === 'green' ? 'selected' : ''}>Green 1000</option>
                  <option value="teal" ${iconFilterState.colorToken === 'teal' ? 'selected' : ''}>Teal 1000</option>
                </select>
                <button type="button" class="filter-chip ${iconFilterState.showGrid ? 'active' : ''}" onclick="toggleIconGrid()">Lưới 24×24</button>
              </div>
            </div>
          </div>

          <!-- Icon Groups Grid -->
          <div id="iconsGridContainer">
            ${sectionsHtml}
          </div>

        </div>
      `;
    }

    function renderIconInspectorContent(ic) {
      const styleKey = resolveIconVariantKey(ic, inspectingStyleKey);
      inspectingStyleKey = styleKey;
      const srcFiles = Array.isArray(ic.src) ? ic.src.join(', ') : (ic.src || '');
      const displayName = typeof getIconDisplayName === 'function' ? getIconDisplayName(ic) : (ic.vi || ic.slug);
      document.getElementById('iiTitle').textContent = `${displayName} (${ic.slug})`;
      document.getElementById('iiSubtitle').textContent = uiLang === 'en'
        ? `Component: ds-icon-${ic.slug} • Source file: ${srcFiles}`
        : `Component: ds-icon-${ic.slug} • File gốc: ${srcFiles}`;
      document.getElementById('iiViName').value = displayName;
      document.getElementById('iiSlug').value = ic.slug;
      document.getElementById('iiVariantLabel').textContent = uiLang === 'en'
        ? (styleKey === 'filled' ? 'Filled' : 'Outlined')
        : (styleKey === 'filled' ? 'Filled (Đặc)' : 'Outlined (Viền)');
      document.getElementById('iiSvgCode').textContent = buildIconSvgTag(ic, 24, 'currentColor', styleKey, true);

      const switcher = document.getElementById('iiVariantSwitcher');
      const availStyles = Object.keys(ic.variants || {});
      switcher.innerHTML = availStyles.map(k => `
        <button type="button" class="seg-btn ${k === styleKey ? 'active' : ''}" onclick="switchInspectorVariant('${k}')">${uiLang === 'en' ? (k === 'filled' ? 'Filled' : 'Outlined') : (k === 'filled' ? 'Filled (Đặc)' : 'Outlined (Viền)')}</button>
      `).join('');

      const statesContainer = document.getElementById('iiStatesPreview');
      const grey = getIconTokenColor('grey');
      const brand = getIconTokenColor('brand');
      statesContainer.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:4px;">
          <div class="icon-24-frame show-grid" style="color:${grey};">${buildIconSvgTag(ic, 24, 'currentColor', styleKey)}</div>
          <span style="font-size:10.5px; color:var(--text-muted);">Default</span>
        </div>
        <div style="display:flex; flex-direction:column; align-items:center; gap:4px;">
          <div class="icon-24-frame show-grid state-hover" style="color:${grey};">${buildIconSvgTag(ic, 24, 'currentColor', styleKey)}</div>
          <span style="font-size:10.5px; color:var(--text-muted);">Hover</span>
        </div>
        <div style="display:flex; flex-direction:column; align-items:center; gap:4px;">
          <div class="icon-24-frame show-grid state-active" style="color:${brand};">${buildIconSvgTag(ic, 24, 'currentColor', styleKey)}</div>
          <span style="font-size:10.5px; color:var(--brand-primary); font-weight:600;">Active</span>
        </div>
        <div style="display:flex; flex-direction:column; align-items:center; gap:4px;">
          <div class="icon-24-frame show-grid state-disabled" style="color:${grey};">${buildIconSvgTag(ic, 24, 'currentColor', styleKey)}</div>
          <span style="font-size:10.5px; color:var(--text-muted);">Disabled</span>
        </div>
        <div style="display:flex; flex-direction:column; align-items:center; gap:4px;">
          <div class="icon-24-frame show-grid variant-tint" style="color:${brand};">${buildIconSvgTag(ic, 24, 'currentColor', styleKey)}</div>
          <span style="font-size:10.5px; color:var(--text-muted);">Tinted</span>
        </div>
      `;
    }

    function openIconInspector(iconId) {
      const ic = iconsCatalog.find(i => i.id === iconId);
      if (!ic) return;
      inspectingIconId = iconId;
      inspectingStyleKey = resolveIconVariantKey(ic);
      renderIconInspectorContent(ic);
      document.getElementById('iconInspectorModal').classList.add('open');
    }

    function switchInspectorVariant(styleKey) {
      const ic = iconsCatalog.find(i => i.id === inspectingIconId);
      if (!ic) return;
      inspectingStyleKey = styleKey;
      renderIconInspectorContent(ic);
    }

    function saveIconMeta() {
      const ic = iconsCatalog.find(i => i.id === inspectingIconId);
      if (!ic) return;
      const newVi = document.getElementById('iiViName').value.trim();
      const newSlug = document.getElementById('iiSlug').value.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-');
      if (newVi) ic.vi = newVi;
      if (newSlug) ic.slug = newSlug;
      saveIconsMetaOverrides();
      closeIconInspector();
      renderCanvas();
      showToast(`Đã cập nhật tên icon: ${ic.vi} (${ic.slug})`);
    }

    function copyCurrentIconSVG() {
      const ic = iconsCatalog.find(i => i.id === inspectingIconId);
      if (ic) copyText(buildIconSvgTag(ic, 24, 'currentColor', inspectingStyleKey, true));
    }

    function downloadCurrentIconSVG() {
      if (inspectingIconId) downloadIconSVG(inspectingIconId, inspectingStyleKey);
    }

    function copyCurrentIconComponent() {
      const ic = iconsCatalog.find(i => i.id === inspectingIconId);
      if (!ic) return;
      const compHtml = `<span class="ds-icon ds-icon-${ic.slug}" aria-label="${escapeHTML(ic.vi)}">\n  ${buildIconSvgTag(ic, 24, 'currentColor', inspectingStyleKey, true)}\n</span>`;
      copyText(compHtml);
    }

    function closeIconInspector() {
      document.getElementById('iconInspectorModal').classList.remove('open');
      inspectingIconId = null;
    }

    function buildIconCSSSnippet() {
      return `.ds-icon {\n  width: 24px;\n  height: 24px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: 6px;\n  color: var(--ds-grey-1000);\n  transition: all 0.15s ease;\n}\n.ds-icon:hover { background: var(--ds-grey-50); }\n.ds-icon.is-active { color: var(--ds-brand-1000); background: var(--ds-brand-50); }\n.ds-icon.is-disabled { opacity: 0.35; pointer-events: none; }`;
    }

    // =========================================================================
    // 2D. LOGOS SYSTEM ENGINE (Offline ./Logo/ Bundle + Download + Replace)
    // =========================================================================
    const LOGOS_STORAGE_KEY = 'de_studio_brand_logos_v1';
    const RAW_USER_LOGOS = Array.isArray(window.USER_LOGOS_BUNDLE) ? window.USER_LOGOS_BUNDLE : [];

    function loadLogosState() {
      const defaults = {
        brandName: 'De Studio',
        items: JSON.parse(JSON.stringify(RAW_USER_LOGOS))
      };
      try {
        const saved = localStorage.getItem(LOGOS_STORAGE_KEY);
        if (!saved) return defaults;
        const parsed = JSON.parse(saved);
        const overrides = parsed.overrides || {};
        return {
          brandName: parsed.brandName || 'De Studio',
          items: defaults.items.map(it => overrides[it.id] ? { ...it, ...overrides[it.id], isCustom: true } : it)
        };
      } catch (e) {
        return defaults;
      }
    }

    let logosState = loadLogosState();
    let logoSurfaceMode = 'auto'; // 'auto' | 'light' | 'dark' | 'brand' | 'checker'
    let pendingUploadLogoId = null;

    function syncLogosToAppChrome() {
      const horiz = logosState.items.find(i => i.id === 'logo-horizontal');
      const brandMark = logosState.items.find(i => i.id === 'logo-mark-brand') || horiz;
      const badgeEl = document.getElementById('topbarBrandBadge');
      if (badgeEl && horiz) {
        badgeEl.innerHTML = `${renderLogoMarkup(horiz)}<span class="brand-ver-pill">1.0</span>`;
      }
      const titleEl = document.getElementById('appDocumentTitle');
      if (titleEl) {
        titleEl.textContent = `${logosState.brandName} 1.0 — SaaS Design System & Offline AI Builder`;
      }
      const favEl = document.getElementById('appFavicon');
      if (favEl && brandMark) {
        if (brandMark.dataUrl) {
          favEl.href = brandMark.dataUrl;
          favEl.type = brandMark.mimeType || 'image/png';
        } else if (brandMark.svg) {
          favEl.type = 'image/svg+xml';
          favEl.href = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(brandMark.svg);
        }
      }
    }

    function saveLogosState() {
      syncLogosToAppChrome();
      const overrides = {};
      RAW_USER_LOGOS.forEach((def, idx) => {
        const cur = logosState.items[idx];
        if (!cur) return;
        if (cur.isCustom || cur.svg !== def.svg || cur.dataUrl !== def.dataUrl || cur.vi !== def.vi) {
          overrides[def.id] = {
            svg: cur.svg || '',
            dataUrl: cur.dataUrl || '',
            mimeType: cur.mimeType || 'image/svg+xml',
            srcFile: cur.srcFile || def.srcFile,
            vi: cur.vi,
            isCustom: Boolean(cur.isCustom)
          };
        }
      });
      try {
        localStorage.setItem(LOGOS_STORAGE_KEY, JSON.stringify({
          brandName: logosState.brandName,
          overrides
        }));
      } catch (e) {
        showToast('Không thể lưu vào trình duyệt (file ảnh quá lớn)');
      }
    }

    function renderLogoMarkup(logoItem, extraStyle = '', opts = {}) {
      if (!logoItem) return '';
      if (logoItem.dataUrl) {
        return `<img src="${logoItem.dataUrl}" alt="${escapeHTML(logoItem.vi)}" style="${extraStyle}" />`;
      }
      const isDarkSurface = opts.forceDark === true || (!opts.forceLight && typeof uiTheme !== 'undefined' && uiTheme === 'dark');
      if (!logoItem.isCustom && logoItem.svg && isDarkSurface) {
        let adaptedSvg = logoItem.svg.replace(/#404041/gi, '#F8FAFC');
        if (opts.adaptMono !== false && logoItem.id === 'logo-mark-mono-dark') {
          adaptedSvg = adaptedSvg.replace(/#111827/gi, '#F8FAFC');
        }
        if (adaptedSvg !== logoItem.svg) {
          return `<img src="data:image/svg+xml;charset=utf-8,${encodeURIComponent(adaptedSvg)}" alt="${escapeHTML(logoItem.vi)}" style="${extraStyle}" />`;
        }
      }
      if (!logoItem.isCustom && logoItem.srcFile) {
        return `<img src="./Logo/${escapeHTML(logoItem.srcFile)}" alt="${escapeHTML(logoItem.vi)}" style="${extraStyle}" />`;
      }
      if (extraStyle && logoItem.svg) {
        return logoItem.svg.replace('<svg ', `<svg style="${extraStyle}" `);
      }
      return logoItem.svg || '';
    }

    function getStageClassForLogo(logoItem) {
      if (logoSurfaceMode !== 'auto') return `bg-${logoSurfaceMode}`;
      if (logoItem.recommendedBg === 'dark') return 'bg-dark';
      return 'bg-light';
    }

    function setLogoSurface(mode) {
      logoSurfaceMode = mode;
      renderCanvas();
    }

    function triggerReplaceLogoSlot(logoId) {
      pendingUploadLogoId = logoId;
      const input = document.getElementById('singleLogoFileInput');
      if (input) {
        input.value = '';
        input.click();
      }
    }

    function readLogoFileIntoItem(logoId, file, onDone) {
      const item = logosState.items.find(i => i.id === logoId);
      if (!item || !file) return;
      const isSvg = file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg');
      const reader = new FileReader();
      reader.onload = () => {
        const res = String(reader.result || '');
        if (isSvg) {
          // Strip XML declaration/doctype if present, normalize sizing cleanly
          const cleanSvg = res.replace(/^[\s\S]*?(?=<svg\b)/i, '').trim();
          if (!cleanSvg.startsWith('<svg')) {
            showToast('File SVG không hợp lệ');
            return;
          }
          item.svg = cleanSvg;
          item.dataUrl = '';
          item.mimeType = 'image/svg+xml';
        } else {
          item.dataUrl = res;
          item.svg = '';
          item.mimeType = file.type || 'image/png';
        }
        item.srcFile = file.name;
        item.isCustom = true;
        saveLogosState();
        if (typeof onDone === 'function') onDone(item);
      };
      if (isSvg) reader.readAsText(file, 'utf-8');
      else reader.readAsDataURL(file);
    }

    function handleSingleLogoFilePicked(e) {
      const file = e.target.files && e.target.files[0];
      if (!file || !pendingUploadLogoId) return;
      const targetId = pendingUploadLogoId;
      pendingUploadLogoId = null;
      readLogoFileIntoItem(targetId, file, (item) => {
        if (document.getElementById('logoReplaceModal').classList.contains('open')) {
          populateLogoReplaceModal();
        }
        renderCanvas();
        showToast(`Đã thay thế "${item.vi}" bằng ${file.name}`);
      });
    }

    function resetSingleLogo(logoId) {
      const def = RAW_USER_LOGOS.find(i => i.id === logoId);
      const idx = logosState.items.findIndex(i => i.id === logoId);
      if (!def || idx === -1) return;
      logosState.items[idx] = JSON.parse(JSON.stringify(def));
      saveLogosState();
      if (document.getElementById('logoReplaceModal').classList.contains('open')) {
        populateLogoReplaceModal();
      }
      renderCanvas();
      showToast(`Đã khôi phục "${def.vi}" về mặc định De Studio`);
    }

    function resetAllLogos() {
      logosState = {
        brandName: 'De Studio',
        items: JSON.parse(JSON.stringify(RAW_USER_LOGOS))
      };
      try { localStorage.removeItem(LOGOS_STORAGE_KEY); } catch (e) {}
      syncLogosToAppChrome();
      if (document.getElementById('logoReplaceModal').classList.contains('open')) {
        populateLogoReplaceModal();
      }
      renderCanvas();
      showToast('Đã khôi phục toàn bộ bộ Logo De Studio mặc định');
    }

    function copyLogoCode(logoId) {
      const item = logosState.items.find(i => i.id === logoId);
      if (!item) return;
      if (item.dataUrl) {
        copyText(`<img src="${item.dataUrl}" alt="${escapeHTML(logosState.brandName)} - ${escapeHTML(item.vi)}" />`, `Đã copy thẻ <img> của ${item.slug}`);
      } else {
        copyText(item.svg, `Đã copy mã SVG "${item.slug}.svg"`);
      }
    }

    function downloadLogoSVG(logoId) {
      const item = logosState.items.find(i => i.id === logoId);
      if (!item) return;
      if (item.dataUrl) {
        const a = document.createElement('a');
        a.href = item.dataUrl;
        a.download = item.srcFile || `${item.slug}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showToast(`Đang tải xuống ${a.download}`);
        return;
      }
      const xml = item.svg.startsWith('<?xml') ? item.svg : `<?xml version="1.0" encoding="UTF-8"?>\n${item.svg}`;
      const blob = new Blob([xml], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${item.slug}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      showToast(`Đang tải xuống ${item.slug}.svg`);
    }

    function downloadLogoPNG(logoId) {
      const item = logosState.items.find(i => i.id === logoId);
      if (!item) return;
      if (item.dataUrl) {
        downloadLogoSVG(logoId);
        return;
      }
      const vbMatch = item.svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/i);
      const wMatch = item.svg.match(/width="([\d.]+)"/i);
      const hMatch = item.svg.match(/height="([\d.]+)"/i);
      const natW = vbMatch ? Number(vbMatch[1]) : (wMatch ? Number(wMatch[1]) : 256);
      const natH = vbMatch ? Number(vbMatch[2]) : (hMatch ? Number(hMatch[1]) : 256);
      const targetHeight = 512;
      const scale = targetHeight / Math.max(1, natH);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(natW * scale);
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      const svgBlob = new Blob([item.svg], { type: 'image/svg+xml;charset=utf-8' });
      const blobUrl = URL.createObjectURL(svgBlob);
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(blobUrl);
        canvas.toBlob((pngBlob) => {
          if (!pngBlob) return;
          const pngUrl = URL.createObjectURL(pngBlob);
          const a = document.createElement('a');
          a.href = pngUrl;
          a.download = `${item.slug}-512h.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(() => URL.revokeObjectURL(pngUrl), 1000);
          showToast(`Đang tải xuống ${item.slug}-512h.png (${canvas.width}×${canvas.height}px)`);
        }, 'image/png');
      };
      img.src = blobUrl;
    }

    function downloadLogosJSON() {
      const payload = {
        brand: logosState.brandName,
        exportedAt: new Date().toISOString(),
        logos: logosState.items.map(it => ({
          id: it.id,
          slug: it.slug,
          name: it.vi,
          recommendedBg: it.recommendedBg,
          srcFile: it.srcFile,
          svg: it.svg || null,
          dataUrl: it.dataUrl || null
        }))
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${logosState.brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-logos.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      showToast('Đã xuất toàn bộ bộ Logo ra JSON');
    }

    function openLogoReplaceModal() {
      populateLogoReplaceModal();
      document.getElementById('logoReplaceModal').classList.add('open');
    }

    function closeLogoReplaceModal() {
      document.getElementById('logoReplaceModal').classList.remove('open');
    }

    function populateLogoReplaceModal() {
      document.getElementById('lrBrandName').value = logosState.brandName || 'De Studio';
      const list = document.getElementById('lrSlotsList');
      list.innerHTML = logosState.items.map(it => `
        <div style="border:1px solid var(--border-default); border-radius:8px; padding:12px 12px; display:flex; align-items:center; justify-content:space-between; gap:8px; background:var(--bg-subtle);">
          <div style="display:flex; align-items:center; gap:12px; min-width:0;">
            <div style="width:68px; height:42px; border-radius:6px; border:1px solid var(--border-default); background:${it.recommendedBg === 'dark' ? '#0f172a' : '#ffffff'}; display:flex; align-items:center; justify-content:center; padding:4px; flex-shrink:0;">
              ${renderLogoMarkup(it, 'max-width:100%; max-height:32px; width:auto; height:auto;', { forceDark: it.recommendedBg === 'dark', forceLight: it.recommendedBg !== 'dark', adaptMono: false })}
            </div>
            <div style="min-width:0;">
              <div style="font-size:12.5px; font-weight:700; color:var(--text-primary);">${escapeHTML(it.vi)}</div>
              <div style="font-size:10.5px; color:var(--text-muted); font-family:var(--font-mono); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
                ${it.slug} • ${escapeHTML(it.srcFile)} ${it.isCustom ? '<span style="color:#059669; font-weight:700;">(Đã tùy chỉnh)</span>' : ''}
              </div>
            </div>
          </div>
          <div style="display:flex; gap:8px; flex-shrink:0;">
            <button type="button" class="btn-ds" style="height:28px; font-size:11px; padding:0 10px;" onclick="triggerReplaceLogoSlot('${it.id}')">Chọn file...</button>
            ${it.isCustom ? `<button type="button" class="btn-ds" style="height:28px; font-size:11px; padding:0 8px;" onclick="resetSingleLogo('${it.id}')" title="Khôi phục slot này">↺</button>` : ''}
          </div>
        </div>
      `).join('');
    }

    function saveLogoBrandSettings() {
      const name = document.getElementById('lrBrandName').value.trim();
      if (name) logosState.brandName = name;
      saveLogosState();
      closeLogoReplaceModal();
      renderCanvas();
      showToast(`Đã lưu thiết lập thương hiệu "${logosState.brandName}"`);
    }

    function buildLogoHTMLSnippet() {
      const horiz = logosState.items.find(i => i.id === 'logo-horizontal');
      const whiteMark = logosState.items.find(i => i.id === 'logo-mark-mono-light');
      return `<!-- 1. Navbar Header (Light Mode) - ${horiz ? horiz.slug : 'logo-horizontal'} -->
<a href="/" class="ds-brand-link" aria-label="${escapeHTML(logosState.brandName)}" style="display:inline-flex;align-items:center;padding:4px 8px;">
  ${renderLogoMarkup(horiz, 'height:32px;width:auto;')}
</a>

<!-- 2. Sidebar Dark Mode - ${whiteMark ? whiteMark.slug : 'logo-mark-mono-light'} -->
<div style="display:inline-flex;align-items:center;gap:8px;padding:12px 16px;background:#0f172a;border-radius:10px;">
  ${renderLogoMarkup(whiteMark, 'width:28px;height:28px;')}
  <span style="color:#fff;font-weight:700;font-size:15px;">${escapeHTML(logosState.brandName)}</span>
</div>`;
    }

    function renderLogosPage() {
      const horiz = logosState.items.find(i => i.id === 'logo-horizontal') || logosState.items[0];
      const vert = logosState.items.find(i => i.id === 'logo-vertical') || logosState.items[0];
      const brandMark = logosState.items.find(i => i.id === 'logo-mark-brand') || logosState.items[0];
      const whiteMark = logosState.items.find(i => i.id === 'logo-mark-mono-light') || brandMark;
      const blackMark = logosState.items.find(i => i.id === 'logo-mark-mono-dark') || brandMark;
      const customCount = logosState.items.filter(i => i.isCustom).length;

      return `
        <div class="colors-toolbar-bar">
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            <span class="ds-badge ds-badge-blue">${logosState.items.length} Biến thể Logo (${escapeHTML(logosState.brandName)})</span>
            ${customCount > 0 ? `<span class="ds-badge ds-badge-green">Đang dùng ${customCount} logo tùy chỉnh</span>` : ''}
            <span style="font-size:12px; color:var(--text-secondary);">
              Đầy đủ quy chuẩn sử dụng, khoảng trống an toàn, tải về <strong>SVG / PNG 2x</strong> hoặc thay thế bằng bộ logo của bạn.
            </span>
          </div>
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <button class="btn-ds" onclick="downloadLogosJSON()">Xuất JSON</button>
            <button class="btn-ds ai" onclick="openLogoReplaceModal()">✦ Thay bộ Logo của bạn</button>
            ${customCount > 0 || logosState.brandName !== 'De Studio' ? `<button class="btn-ds" onclick="resetAllLogos()">↺ Khôi phục mặc định</button>` : ''}
          </div>
        </div>

        <div class="logos-sheet">
          <!-- 1. Intro & Principles -->
          <div class="typo-header-block">
            <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.05em;">NỀN TẢNG • FOUNDATIONS / LOGOS</div>
            <h1 style="font-size:24px; font-weight:700; color:var(--text-primary); margin-top:4px; letter-spacing:-0.02em;">Hệ thống Nhận diện Logo — ${escapeHTML(logosState.brandName)}</h1>
            <p style="font-size:13px; color:var(--text-secondary); max-width:820px; margin-top:8px; line-height:1.6;">
              Bộ logo chính thức của <strong>${escapeHTML(logosState.brandName)}</strong> được xây dựng từ các file vector chuẩn trong thư mục <code>Logo/</code> gồm phiên bản <strong>Ngang (Horizontal)</strong>, <strong>Dọc (Vertical)</strong> và bộ <strong>Biểu tượng (Logomark: Màu / Đen / Trắng)</strong> để đáp ứng nhất quán trên giao diện Light/Dark Mode, ứng dụng di động và in ấn.
            </p>

            <div class="colors-principles-grid">
              <div class="principle-card">
                <div class="principle-card-title">1. Chọn đúng Lockup theo không gian</div>
                <div class="principle-card-desc">Dùng <b>Logo Ngang</b> cho thanh Header/Navbar; dùng <b>Logo Dọc</b> cho màn hình Đăng nhập/Splash; dùng <b>Logomark</b> cho Favicon và Sidebar thu gọn.</div>
              </div>
              <div class="principle-card">
                <div class="principle-card-title">2. Tương phản Light / Dark chuẩn</div>
                <div class="principle-card-desc">Nền sáng dùng bản <b>Màu (#8194FF)</b> hoặc <b>Mono Black</b>; nền tối hoặc nền màu thương hiệu dùng <b>Mono White (#FFFFFF)</b>.</div>
              </div>
              <div class="principle-card">
                <div class="principle-card-title">3. Dễ dàng tải &amp; Thay thế thương hiệu</div>
                <div class="principle-card-desc">Cho phép <b>Copy SVG</b>, tải <b>.svg / .png 512px</b> từng phiên bản hoặc tải lên logo riêng để áp dụng ngay cho Design System này.</div>
              </div>
            </div>
          </div>

          <!-- 2. Brand Logo Matrix + Surface Switcher -->
          <div class="logos-section-block">
            <div class="icons-section-head" style="flex-wrap:wrap; gap:8px;">
              <div>
                <div class="icons-section-title">
                  <span>Bộ 5 Trạng thái Logo Chuẩn</span>
                  <span class="ds-badge ds-badge-gray">${logosState.items.length} assets</span>
                </div>
                <div style="font-size:12px; color:var(--text-muted); margin-top:2px;">Nhấn <b>Thay logo</b> trên từng thẻ để upload SVG/PNG riêng cho trạng thái tương ứng.</div>
              </div>
              <div class="state-group">
                <span>Nền xem trước:</span>
                <div class="seg-control">
                  <button type="button" class="seg-btn ${logoSurfaceMode === 'auto' ? 'active' : ''}" onclick="setLogoSurface('auto')">Tự động</button>
                  <button type="button" class="seg-btn ${logoSurfaceMode === 'light' ? 'active' : ''}" onclick="setLogoSurface('light')">Nền Sáng</button>
                  <button type="button" class="seg-btn ${logoSurfaceMode === 'dark' ? 'active' : ''}" onclick="setLogoSurface('dark')">Nền Tối</button>
                  <button type="button" class="seg-btn ${logoSurfaceMode === 'brand' ? 'active' : ''}" onclick="setLogoSurface('brand')">Nền Brand</button>
                  <button type="button" class="seg-btn ${logoSurfaceMode === 'checker' ? 'active' : ''}" onclick="setLogoSurface('checker')">Trong suốt</button>
                </div>
              </div>
            </div>

            <div class="logos-grid">
              ${logosState.items.map(it => {
                const bgCls = getStageClassForLogo(it);
                const stageIsDark = bgCls === 'bg-dark' || bgCls === 'bg-brand';
                return `
                  <div class="logo-card">
                    <div class="logo-stage ${bgCls}">
                      <div class="logo-stage-badges">
                        <span class="logo-pill">${escapeHTML(it.role)}</span>
                        ${it.isCustom ? '<span class="logo-pill custom">Tùy chỉnh</span>' : `<span class="logo-pill">${escapeHTML(it.srcFile)}</span>`}
                      </div>
                      <div class="logo-stage-render">
                        ${renderLogoMarkup(it, '', { forceDark: stageIsDark, forceLight: !stageIsDark, adaptMono: false })}
                      </div>
                    </div>

                    <div class="logo-card-body">
                      <div>
                        <div style="display:flex; align-items:center; justify-content:space-between; gap:8px;">
                          <div class="logo-meta-title">${escapeHTML(it.vi)}</div>
                          ${it.isCustom ? `<button type="button" class="typo-edit-pill" onclick="resetSingleLogo('${it.id}')" title="Khôi phục logo gốc">↺ Mặc định</button>` : ''}
                        </div>
                        <div class="logo-meta-slug">${escapeHTML(it.slug)} • ${escapeHTML(it.enName)}</div>
                      </div>

                      <div class="logo-card-specs">
                        <span>Tỷ lệ: ${escapeHTML(it.ratio)}</span>
                        <span>${escapeHTML(it.minSize)}</span>
                      </div>

                      <div class="logo-guide-box">
                        <strong style="color:var(--text-primary);">Khi nào sử dụng:</strong> ${escapeHTML(it.usage)}
                      </div>

                      <div class="logo-avoid-note">
                        <strong>Lưu ý tránh:</strong> ${escapeHTML(it.avoid)}
                      </div>

                      <div class="logo-card-actions">
                        <button type="button" class="logo-action-btn" onclick="copyLogoCode('${it.id}')" title="Sao chép mã SVG / HTML">Copy SVG</button>
                        <button type="button" class="logo-action-btn" onclick="downloadLogoSVG('${it.id}')" title="Tải về file SVG vector">Tải .svg</button>
                        <button type="button" class="logo-action-btn" onclick="downloadLogoPNG('${it.id}')" title="Xuất ảnh PNG độ nét cao 512px">Tải .png</button>
                        <button type="button" class="logo-action-btn replace" onclick="triggerReplaceLogoSlot('${it.id}')" title="Tải lên logo thay thế">Thay logo</button>
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- 3. Clearspace & Minimum Size -->
          <div class="logos-section-block">
            <div class="icons-section-title">
              <span>Quy chuẩn Khoảng trống An toàn (Clearspace) &amp; Kích thước Tối thiểu</span>
            </div>
            <p style="font-size:12.5px; color:var(--text-secondary); margin-top:4px; line-height:1.5;">
              Luôn giữ một vùng đệm trống tối thiểu bằng <code>x</code> (tương đương 1/4 chiều cao biểu tượng cánh sao) xung quanh logo để không bị văn bản, nút bấm hoặc cạnh màn hình chèn ép.
            </p>
            <div class="logo-clearspace-grid">
              <div class="clearspace-panel">
                <div class="clearspace-blueprint">
                  <span class="clearspace-tag" style="top:3px; left:50%; transform:translateX(-50%);">x</span>
                  <span class="clearspace-tag" style="bottom:3px; left:50%; transform:translateX(-50%);">x</span>
                  <span class="clearspace-tag" style="left:4px; top:50%; transform:translateY(-50%);">x</span>
                  <span class="clearspace-tag" style="right:4px; top:50%; transform:translateY(-50%);">x</span>
                  <div class="clearspace-inner-box">
                    ${renderLogoMarkup(horiz)}
                  </div>
                </div>
                <div style="text-align:center;">
                  <div style="font-size:12.5px; font-weight:700; color:var(--text-primary);">Khoảng trống Logo Ngang</div>
                  <div style="font-size:11.5px; color:var(--text-muted); margin-top:2px;">Tối thiểu Digital: <b>120×43px</b> (chiều cao chữ ≥ 14px) • Print: <b>32mm</b></div>
                </div>
              </div>

              <div class="clearspace-panel">
                <div class="clearspace-blueprint">
                  <span class="clearspace-tag" style="top:3px; left:50%; transform:translateX(-50%);">x</span>
                  <span class="clearspace-tag" style="bottom:3px; left:50%; transform:translateX(-50%);">x</span>
                  <span class="clearspace-tag" style="left:4px; top:50%; transform:translateY(-50%);">x</span>
                  <span class="clearspace-tag" style="right:4px; top:50%; transform:translateY(-50%);">x</span>
                  <div class="clearspace-inner-box">
                    ${renderLogoMarkup(brandMark)}
                  </div>
                </div>
                <div style="text-align:center;">
                  <div style="font-size:12.5px; font-weight:700; color:var(--text-primary);">Khoảng trống Logomark / App Icon</div>
                  <div style="font-size:11.5px; color:var(--text-muted); margin-top:2px;">Tối thiểu Favicon: <b>16×16px</b> • UI Sidebar/Avatar: <b>24×24px → 48×48px</b></div>
                </div>
              </div>
            </div>
          </div>

          <!-- 4. Live UI Placement Mockups -->
          <div class="logos-section-block">
            <div class="icons-section-title">
              <span>Ứng dụng Thực tế trên Giao diện SaaS (Live Preview)</span>
            </div>
            <div class="logo-mockups-grid">
              <!-- Mockup 1: Light Navbar -->
              <div class="logo-mockup-card">
                <div style="padding:12px 16px; border-bottom:1px solid var(--border-default); display:flex; align-items:center; justify-content:space-between; background:#ffffff;">
                  <div style="display:flex; align-items:center; gap:16px;">
                    ${renderLogoMarkup(horiz, 'height:28px; width:auto;', { forceLight: true })}
                    <span style="font-size:11px; color:#475569;">Sản phẩm</span>
                    <span style="font-size:11px; color:#475569;">Bảng giá</span>
                  </div>
                  <span style="font-size:10px; padding:4px 9px; border-radius:99px; background:#eff6ff; color:#1d4ed8; font-weight:600;">Bắt đầu</span>
                </div>
                <div style="padding:12px 16px; background:var(--bg-subtle); font-size:11.5px; color:var(--text-secondary);">
                  <strong>1. Header Navigation (Light Mode):</strong> Dùng <code>logo-horizontal</code> cao 28–36px căn trái.
                </div>
              </div>

              <!-- Mockup 2: Dark Sidebar & Brand Badge -->
              <div class="logo-mockup-card">
                <div style="padding:12px 16px; background:#0f172a; color:#ffffff; display:flex; align-items:center; justify-content:space-between;">
                  <div style="display:flex; align-items:center; gap:8px;">
                    <div style="width:32px; height:32px; border-radius:8px; background:linear-gradient(135deg,#3758f9,#6366f1); display:flex; align-items:center; justify-content:center; padding:4px;">
                      ${renderLogoMarkup(whiteMark, 'width:22px; height:22px;', { forceDark: true })}
                    </div>
                    <div>
                      <div style="font-size:12.5px; font-weight:700;">${escapeHTML(logosState.brandName)}</div>
                      <div style="font-size:10px; color:#94a3b8;">SaaS Workspace</div>
                    </div>
                  </div>
                  <span style="font-size:10px; padding:2px 8px; box-sizing:border-box; border-radius:99px; background:rgba(255,255,255,0.1); color:#cbd5e1;">Pro</span>
                </div>
                <div style="padding:12px 16px; background:var(--bg-subtle); font-size:11.5px; color:var(--text-secondary);">
                  <strong>2. Dark Sidebar &amp; App Icon:</strong> Dùng <code>logo-mark-mono-light</code> trên nền Brand / Dark.
                </div>
              </div>

              <!-- Mockup 3: Splash / Login Card -->
              <div class="logo-mockup-card">
                <div style="padding:16px; background:#ffffff; border-bottom:1px solid var(--border-default); display:flex; flex-direction:column; align-items:center; gap:8px; text-align:center;">
                  ${renderLogoMarkup(vert, 'height:62px; width:auto;', { forceLight: true })}
                  <div style="font-size:11px; color:#64748b;">Đăng nhập vào không gian làm việc</div>
                </div>
                <div style="padding:12px 16px; background:var(--bg-subtle); font-size:11.5px; color:var(--text-secondary);">
                  <strong>3. Login / Splash Screen:</strong> Dùng <code>logo-vertical</code> căn giữa trang.
                </div>
              </div>
            </div>
          </div>

          <!-- 5. Do's & Don'ts -->
          <div class="logos-section-block">
            <div class="icons-section-title">
              <span>Quy tắc Nên &amp; Không nên (Do's &amp; Don'ts)</span>
            </div>
            <div class="logo-dos-grid">
              <div class="logo-do-card">
                <div class="logo-do-badge ok">✓ NÊN: Giữ nguyên tỷ lệ gốc</div>
                <div style="height:64px; background:#ffffff; border:1px solid #e2e8f0; border-radius:6px; display:flex; align-items:center; justify-content:center; padding:8px;">
                  ${renderLogoMarkup(horiz, 'height:38px; width:auto;', { forceLight: true })}
                </div>
                <div style="font-size:11.5px; color:var(--text-secondary);">Luôn giữ <code>object-fit: contain</code> hoặc khóa tỷ lệ Width/Height khi scale.</div>
              </div>

              <div class="logo-do-card">
                <div class="logo-do-badge bad">✕ KHÔNG NÊN: Kéo méo tỷ lệ</div>
                <div style="height:64px; background:#fef2f2; border:1px solid #fecaca; border-radius:6px; display:flex; align-items:center; justify-content:center; padding:8px; overflow:hidden;">
                  <div style="transform:scaleX(1.55) scaleY(0.65);">${renderLogoMarkup(horiz, 'height:38px; width:auto;', { forceLight: true })}</div>
                </div>
                <div style="font-size:11.5px; color:var(--text-secondary);">Không kéo giãn ngang/dọc làm biến dạng chữ và góc bo của biểu tượng.</div>
              </div>

              <div class="logo-do-card">
                <div class="logo-do-badge ok">✓ NÊN: Dùng Mono White trên nền tối</div>
                <div style="height:64px; background:#0f172a; border-radius:6px; display:flex; align-items:center; justify-content:center; padding:8px;">
                  ${renderLogoMarkup(whiteMark, 'height:42px; width:auto;', { forceDark: true })}
                </div>
                <div style="font-size:11.5px; color:var(--text-secondary);">Sử dụng bản đơn sắc trắng hoặc bản màu sáng khi nền đạt độ tối cao.</div>
              </div>

              <div class="logo-do-card">
                <div class="logo-do-badge bad">✕ KHÔNG NÊN: Đặt logo tối trên nền tối</div>
                <div style="height:64px; background:#111827; border-radius:6px; display:flex; align-items:center; justify-content:center; padding:8px;">
                  <div style="opacity:0.35;">${renderLogoMarkup(blackMark, 'height:42px; width:auto;', { forceLight: true, adaptMono: false })}</div>
                </div>
                <div style="font-size:11.5px; color:var(--text-secondary);">Tránh dùng <code>Mono Black</code> trên nền tối khiến logo mất khả năng nhận diện.</div>
              </div>
            </div>
          </div>

        </div>
      `;
    }

    // =========================================================================
    // 2E. EFFECT STYLES ENGINE (Shadows xs..3xl + Backdrop Blurs Light/Dark)
    // =========================================================================
    const EFFECTS_STORAGE_KEY = 'de_studio_effect_styles_v1';

    const DEFAULT_SHADOW_STYLES = [
      {
        id: 'shadow-xs',
        token: '--ds-shadow-xs',
        name: 'Shadow xs',
        vi: 'Đổ bóng Siêu nhẹ (Extra Small)',
        usage: 'Dùng cho ô nhập liệu (Input), nút phụ, badge nổi nhẹ hoặc phân tách thẻ nhỏ.',
        layers: [
          { x: 0, y: 1, blur: 2, spread: 0, color: '#101828', alpha: 0.05 }
        ]
      },
      {
        id: 'shadow-sm',
        token: '--ds-shadow-sm',
        name: 'Shadow sm',
        vi: 'Đổ bóng Nhỏ (Small)',
        usage: 'Dùng cho Card mặc định, nút khi Hover, hàng bảng nổi và Toggle knob.',
        layers: [
          { x: 0, y: 1, blur: 3, spread: 0, color: '#101828', alpha: 0.10 },
          { x: 0, y: 1, blur: 2, spread: -1, color: '#101828', alpha: 0.10 }
        ]
      },
      {
        id: 'shadow-md',
        token: '--ds-shadow-md',
        name: 'Shadow md',
        vi: 'Đổ bóng Vừa (Medium)',
        usage: 'Dùng cho Menu thả xuống (Dropdown), bộ chọn ngày (Datepicker) và Card tương tác.',
        layers: [
          { x: 0, y: 4, blur: 8, spread: -2, color: '#101828', alpha: 0.10 },
          { x: 0, y: 2, blur: 4, spread: -2, color: '#101828', alpha: 0.06 }
        ]
      },
      {
        id: 'shadow-lg',
        token: '--ds-shadow-lg',
        name: 'Shadow lg',
        vi: 'Đổ bóng Lớn (Large)',
        usage: 'Dùng cho Popover, thanh công cụ nổi (Floating Toolbar) và Card kéo thả.',
        layers: [
          { x: 0, y: 12, blur: 16, spread: -4, color: '#101828', alpha: 0.08 },
          { x: 0, y: 4, blur: 6, spread: -2, color: '#101828', alpha: 0.03 }
        ]
      },
      {
        id: 'shadow-xl',
        token: '--ds-shadow-xl',
        name: 'Shadow xl',
        vi: 'Đổ bóng Rất lớn (Extra Large)',
        usage: 'Dùng cho Ngăn kéo (Drawer Overlay), Notification Toast Stack và Dialog nhỏ.',
        layers: [
          { x: 0, y: 20, blur: 24, spread: -4, color: '#101828', alpha: 0.08 },
          { x: 0, y: 8, blur: 8, spread: -4, color: '#101828', alpha: 0.03 }
        ]
      },
      {
        id: 'shadow-2xl',
        token: '--ds-shadow-2xl',
        name: 'Shadow 2xl',
        vi: 'Đổ bóng Cực đại 2XL (Modal)',
        usage: 'Dùng cho Hộp thoại Modal Pop-up, Command Palette (Ctrl+K) và Lightbox.',
        layers: [
          { x: 0, y: 24, blur: 48, spread: -12, color: '#101828', alpha: 0.18 }
        ]
      },
      {
        id: 'shadow-3xl',
        token: '--ds-shadow-3xl',
        name: 'Shadow 3xl',
        vi: 'Đổ bóng Tối đa 3XL (Showcase)',
        usage: 'Dùng cho Khung trình diễn sản phẩm (Hero App Frame) và lớp nổi cấp cao nhất.',
        layers: [
          { x: 0, y: 32, blur: 64, spread: -12, color: '#101828', alpha: 0.14 }
        ]
      }
    ];

    const DEFAULT_BLUR_STYLES = [
      { id: 'blur-sm-light', token: '--ds-blur-sm-light', name: 'sm light', tone: 'light', vi: 'Kính mờ Nhỏ (Sáng)', blur: 8, bgColor: '#FFFFFF', bgAlpha: 0.60, usage: 'Badge trên ảnh, nút nổi kích thước nhỏ trên nền sáng.' },
      { id: 'blur-md-light', token: '--ds-blur-md-light', name: 'md light', tone: 'light', vi: 'Kính mờ Vừa (Sáng)', blur: 12, bgColor: '#FFFFFF', bgAlpha: 0.65, usage: 'Sticky Header trong suốt, thanh điều hướng nổi.' },
      { id: 'blur-lg-light', token: '--ds-blur-lg-light', name: 'lg light', tone: 'light', vi: 'Kính mờ Lớn (Sáng)', blur: 16, bgColor: '#FFFFFF', bgAlpha: 0.72, usage: 'Popover kính mờ, Drawer điều hướng bên.' },
      { id: 'blur-xl-light', token: '--ds-blur-xl-light', name: 'xl light', tone: 'light', vi: 'Kính mờ Cực đại (Sáng)', blur: 24, bgColor: '#FFFFFF', bgAlpha: 0.80, usage: 'Modal Glassmorphism toàn màn hình, lớp che phủ cao cấp.' },
      { id: 'blur-sm-dark', token: '--ds-blur-sm-dark', name: 'sm dark', tone: 'dark', vi: 'Kính mờ Nhỏ (Tối)', blur: 8, bgColor: '#1F242D', bgAlpha: 0.55, usage: 'Thẻ nhãn trên video, nút phát mini trên nền ảnh.' },
      { id: 'blur-md-dark', token: '--ds-blur-md-dark', name: 'md dark', tone: 'dark', vi: 'Kính mờ Vừa (Tối)', blur: 12, bgColor: '#1F242D', bgAlpha: 0.65, usage: 'Dark Tooltip nổi, thanh Player media.' },
      { id: 'blur-lg-dark', token: '--ds-blur-lg-dark', name: 'lg dark', tone: 'dark', vi: 'Kính mờ Lớn (Tối)', blur: 16, bgColor: '#1F242D', bgAlpha: 0.74, usage: 'HUD điều khiển Dark Mode, Sticky Bar tối.' },
      { id: 'blur-xl-dark', token: '--ds-blur-xl-dark', name: 'xl dark', tone: 'dark', vi: 'Kính mờ Cực đại (Tối)', blur: 24, bgColor: '#1F242D', bgAlpha: 0.82, usage: 'Dark Backdrop Overlay, Lock Screen / Modal tối.' }
    ];

    function loadEffectStyles() {
      const def = {
        shadows: JSON.parse(JSON.stringify(DEFAULT_SHADOW_STYLES)),
        blurs: JSON.parse(JSON.stringify(DEFAULT_BLUR_STYLES))
      };
      try {
        const saved = localStorage.getItem(EFFECTS_STORAGE_KEY);
        if (!saved) return def;
        const parsed = JSON.parse(saved);
        return {
          shadows: def.shadows.map(s => (parsed.shadows && parsed.shadows[s.id]) ? { ...s, ...parsed.shadows[s.id] } : s),
          blurs: def.blurs.map(b => (parsed.blurs && parsed.blurs[b.id]) ? { ...b, ...parsed.blurs[b.id] } : b)
        };
      } catch (e) {
        return def;
      }
    }

    let effectStylesState = loadEffectStyles();
    let blurSceneMode = 'botanical'; // 'botanical' | 'gradient' | 'dark'
    let editingEffectMeta = null; // { kind: 'shadow'|'blur', id: string, draft: object }

    function saveEffectStyles() {
      const sMap = {}, bMap = {};
      DEFAULT_SHADOW_STYLES.forEach((def, idx) => {
        const cur = effectStylesState.shadows[idx];
        if (JSON.stringify(cur) !== JSON.stringify(def)) {
          sMap[def.id] = { vi: cur.vi, layers: cur.layers };
        }
      });
      DEFAULT_BLUR_STYLES.forEach((def, idx) => {
        const cur = effectStylesState.blurs[idx];
        if (JSON.stringify(cur) !== JSON.stringify(def)) {
          bMap[def.id] = { vi: cur.vi, blur: cur.blur, bgAlpha: cur.bgAlpha, bgColor: cur.bgColor };
        }
      });
      try {
        localStorage.setItem(EFFECTS_STORAGE_KEY, JSON.stringify({ shadows: sMap, blurs: bMap }));
      } catch (e) {}
      syncEffectsToCSS();
    }

    function hexToRgbaStr(hex, alpha) {
      const h = (hex || '#101828').replace('#', '');
      const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
      const r = parseInt(full.slice(0, 2), 16) || 0;
      const g = parseInt(full.slice(2, 4), 16) || 0;
      const b = parseInt(full.slice(4, 6), 16) || 0;
      const a = Math.max(0, Math.min(1, Number(alpha) || 0));
      return `rgba(${r}, ${g}, ${b}, ${Number(a.toFixed(2))})`;
    }

    function buildShadowCssValue(shadowObj) {
      return (shadowObj.layers || [])
        .map(l => `${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${hexToRgbaStr(l.color, l.alpha)}`)
        .join(', ');
    }

    function buildBlurCssDecl(blurObj) {
      const bg = hexToRgbaStr(blurObj.bgColor, blurObj.bgAlpha);
      return `background: ${bg}; backdrop-filter: blur(${blurObj.blur}px); -webkit-backdrop-filter: blur(${blurObj.blur}px);`;
    }

    function syncEffectsToCSS() {
      const root = document.documentElement;
      effectStylesState.shadows.forEach(s => {
        const val = buildShadowCssValue(s);
        root.style.setProperty(s.token, val);
        if (['shadow-xs', 'shadow-sm', 'shadow-md', 'shadow-lg'].includes(s.id)) {
          root.style.setProperty(`--${s.id}`, val);
        }
      });
      effectStylesState.blurs.forEach(b => {
        root.style.setProperty(b.token, `${b.blur}px`);
        root.style.setProperty(`${b.token}-bg`, hexToRgbaStr(b.bgColor, b.bgAlpha));
      });
    }

    function buildEffectsCSSTokens() {
      const lines = [':root {', '  /* Elevation Shadows (De Studio 1.0) */'];
      effectStylesState.shadows.forEach(s => {
        lines.push(`  ${s.token}: ${buildShadowCssValue(s)};`);
      });
      lines.push('', '  /* Glassmorphism Backdrop Blurs */');
      effectStylesState.blurs.forEach(b => {
        lines.push(`  ${b.token}: ${b.blur}px;`);
        lines.push(`  ${b.token}-bg: ${hexToRgbaStr(b.bgColor, b.bgAlpha)};`);
      });
      lines.push('}');
      lines.push('', '/* Ví dụ class tiện ích Glass Blur */');
      effectStylesState.blurs.slice(0, 2).forEach(b => {
        lines.push(`.${b.id} { ${buildBlurCssDecl(b)} }`);
      });
      return lines.join('\n');
    }

    function setBlurScene(mode) {
      blurSceneMode = mode;
      renderCanvas();
    }

    function copyShadowCSS(id) {
      const s = effectStylesState.shadows.find(x => x.id === id);
      if (s) copyText(`box-shadow: ${buildShadowCssValue(s)};`, `Đã copy box-shadow của ${s.name}`);
    }

    function copyBlurCSS(id) {
      const b = effectStylesState.blurs.find(x => x.id === id);
      if (b) copyText(buildBlurCssDecl(b), `Đã copy CSS Blur của ${b.name}`);
    }

    function openEffectEditor(kind, id) {
      const src = kind === 'shadow'
        ? effectStylesState.shadows.find(s => s.id === id)
        : effectStylesState.blurs.find(b => b.id === id);
      if (!src) return;
      editingEffectMeta = { kind, id, draft: JSON.parse(JSON.stringify(src)) };
      renderEffectEditorModal();
      document.getElementById('effectEditorModal').classList.add('open');
    }

    function closeEffectEditor() {
      document.getElementById('effectEditorModal').classList.remove('open');
      editingEffectMeta = null;
    }

    function renderEffectEditorModal() {
      if (!editingEffectMeta) return;
      const { kind, draft } = editingEffectMeta;
      document.getElementById('eeTitle').textContent = `Chỉnh sửa ${draft.name} — ${draft.vi}`;
      document.getElementById('eeSubtitle').textContent = kind === 'shadow'
        ? `${draft.layers.length} Drop Shadow Layer(s) • Click chỉnh X / Y / Blur / Spread / Alpha`
        : `Backdrop Blur Glass • Chỉnh độ mờ Blur (px) & Độ trong suốt nền (%)`;
      document.getElementById('eeViName').value = draft.vi;
      document.getElementById('eeToken').value = draft.token;

      const body = document.getElementById('eeParamsBody');
      if (kind === 'shadow') {
        body.innerHTML = draft.layers.map((l, idx) => `
          <div style="border:1px solid var(--border-default); border-radius:8px; padding:12px 12px; background:#fafbfd;">
            <div style="font-size:11px; font-weight:700; color:var(--text-secondary); margin-bottom:8px;">Layer ${idx + 1} (Drop shadow)</div>
            <div style="display:grid; grid-template-columns:repeat(6, 1fr); gap:8px;">
              <div>
                <label style="font-size:10px; color:var(--text-muted); display:block;">X (px)</label>
                <input type="number" class="ds-input" style="height:28px; font-size:11.5px; padding:0 6px;" value="${l.x}" oninput="updateEffectDraftLayer(${idx}, 'x', Number(this.value))" />
              </div>
              <div>
                <label style="font-size:10px; color:var(--text-muted); display:block;">Y (px)</label>
                <input type="number" class="ds-input" style="height:28px; font-size:11.5px; padding:0 6px;" value="${l.y}" oninput="updateEffectDraftLayer(${idx}, 'y', Number(this.value))" />
              </div>
              <div>
                <label style="font-size:10px; color:var(--text-muted); display:block;">Blur</label>
                <input type="number" min="0" class="ds-input" style="height:28px; font-size:11.5px; padding:0 6px;" value="${l.blur}" oninput="updateEffectDraftLayer(${idx}, 'blur', Number(this.value))" />
              </div>
              <div>
                <label style="font-size:10px; color:var(--text-muted); display:block;">Spread</label>
                <input type="number" class="ds-input" style="height:28px; font-size:11.5px; padding:0 6px;" value="${l.spread}" oninput="updateEffectDraftLayer(${idx}, 'spread', Number(this.value))" />
              </div>
              <div>
                <label style="font-size:10px; color:var(--text-muted); display:block;">Alpha %</label>
                <input type="number" min="0" max="100" class="ds-input" style="height:28px; font-size:11.5px; padding:0 6px;" value="${Math.round(l.alpha * 100)}" oninput="updateEffectDraftLayer(${idx}, 'alpha', Number(this.value)/100)" />
              </div>
              <div>
                <label style="font-size:10px; color:var(--text-muted); display:block;">Màu</label>
                <input type="color" style="width:100%; height:28px; border:1px solid var(--border-default); border-radius:6px; cursor:pointer;" value="${l.color}" oninput="updateEffectDraftLayer(${idx}, 'color', this.value)" />
              </div>
            </div>
          </div>
        `).join('');
      } else {
        body.innerHTML = `
          <div style="border:1px solid var(--border-default); border-radius:8px; padding:12px; background:#fafbfd; display:grid; grid-template-columns:repeat(3, 1fr); gap:8px;">
            <div>
              <label style="font-size:11px; color:var(--text-muted); display:block; margin-bottom:4px;">Background Blur (px)</label>
              <input type="number" min="0" max="64" class="ds-input" style="height:32px;" value="${draft.blur}" oninput="updateBlurDraft('blur', Number(this.value))" />
            </div>
            <div>
              <label style="font-size:11px; color:var(--text-muted); display:block; margin-bottom:4px;">Độ đục nền (%)</label>
              <input type="number" min="5" max="100" class="ds-input" style="height:32px;" value="${Math.round(draft.bgAlpha * 100)}" oninput="updateBlurDraft('bgAlpha', Number(this.value)/100)" />
            </div>
            <div>
              <label style="font-size:11px; color:var(--text-muted); display:block; margin-bottom:4px;">Màu nền kính</label>
              <input type="color" style="width:100%; height:32px; border:1px solid var(--border-default); border-radius:6px; cursor:pointer;" value="${draft.bgColor}" oninput="updateBlurDraft('bgColor', this.value)" />
            </div>
          </div>
        `;
      }
      refreshEffectEditorPreview();
    }

    function updateEffectDraftLayer(idx, key, val) {
      if (!editingEffectMeta) return;
      editingEffectMeta.draft.layers[idx][key] = val;
      refreshEffectEditorPreview();
    }

    function updateBlurDraft(key, val) {
      if (!editingEffectMeta) return;
      editingEffectMeta.draft[key] = val;
      refreshEffectEditorPreview();
    }

    function refreshEffectEditorPreview() {
      if (!editingEffectMeta) return;
      const { kind, draft } = editingEffectMeta;
      const preview = document.getElementById('eePreviewWrap');
      const codeEl = document.getElementById('eeCssCode');
      if (kind === 'shadow') {
        const val = buildShadowCssValue(draft);
        preview.style.background = '#f8fafc';
        preview.innerHTML = `<div style="width:170px; height:76px; border-radius:10px; background:#ffffff; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; color:#0f172a; box-shadow:${val};">${escapeHTML(draft.name)}</div>`;
        codeEl.textContent = `box-shadow: ${val};`;
      } else {
        const cssDecl = buildBlurCssDecl(draft);
        preview.style.background = 'linear-gradient(135deg, #3758f9 0%, #10b981 55%, #f59e0b 100%)';
        preview.innerHTML = `<div style="width:230px; height:64px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:12.5px; font-weight:700; color:${draft.tone === 'dark' ? '#fff' : '#0f172a'}; border:1px solid rgba(255,255,255,0.45); ${cssDecl}">${escapeHTML(draft.name)} (${draft.blur}px)</div>`;
        codeEl.textContent = cssDecl;
      }
    }

    function saveEffectEditor() {
      if (!editingEffectMeta) return;
      const { kind, id, draft } = editingEffectMeta;
      const newVi = document.getElementById('eeViName').value.trim();
      if (newVi) draft.vi = newVi;
      if (kind === 'shadow') {
        const idx = effectStylesState.shadows.findIndex(s => s.id === id);
        if (idx !== -1) effectStylesState.shadows[idx] = draft;
      } else {
        const idx = effectStylesState.blurs.findIndex(b => b.id === id);
        if (idx !== -1) effectStylesState.blurs[idx] = draft;
      }
      saveEffectStyles();
      closeEffectEditor();
      renderCanvas();
      showToast(`Đã lưu thông số "${draft.name}"`);
    }

    function resetSingleEffect() {
      if (!editingEffectMeta) return;
      const { kind, id } = editingEffectMeta;
      if (kind === 'shadow') {
        const def = DEFAULT_SHADOW_STYLES.find(s => s.id === id);
        const idx = effectStylesState.shadows.findIndex(s => s.id === id);
        if (def && idx !== -1) effectStylesState.shadows[idx] = JSON.parse(JSON.stringify(def));
      } else {
        const def = DEFAULT_BLUR_STYLES.find(b => b.id === id);
        const idx = effectStylesState.blurs.findIndex(b => b.id === id);
        if (def && idx !== -1) effectStylesState.blurs[idx] = JSON.parse(JSON.stringify(def));
      }
      saveEffectStyles();
      closeEffectEditor();
      renderCanvas();
      showToast('Đã khôi phục thông số mặc định');
    }

    function resetAllEffects() {
      effectStylesState = {
        shadows: JSON.parse(JSON.stringify(DEFAULT_SHADOW_STYLES)),
        blurs: JSON.parse(JSON.stringify(DEFAULT_BLUR_STYLES))
      };
      try { localStorage.removeItem(EFFECTS_STORAGE_KEY); } catch (e) {}
      syncEffectsToCSS();
      renderCanvas();
      showToast('Đã khôi phục toàn bộ Effect styles mặc định');
    }

    function copyCurrentEffectCSS() {
      const txt = document.getElementById('eeCssCode').textContent;
      if (txt) copyText(txt, 'Đã copy mã CSS hiệu ứng');
    }

    function renderBotanicalBackdropSVG() {
      return `
        <svg class="blurs-bg-art" viewBox="0 0 900 420" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="efBgSky" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#e3ebe4"/>
              <stop offset="50%" stop-color="#cbd8cd"/>
              <stop offset="100%" stop-color="#9cb5a4"/>
            </linearGradient>
            <linearGradient id="efLeafA" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#5d8267"/>
              <stop offset="100%" stop-color="#2c4a36"/>
            </linearGradient>
            <linearGradient id="efLeafB" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stop-color="#243f2d"/>
              <stop offset="100%" stop-color="#769b7f"/>
            </linearGradient>
          </defs>
          <rect width="900" height="420" fill="url(#efBgSky)"/>
          <path d="M160 420 C165 300 220 190 250 80" stroke="#395541" stroke-width="10" fill="none"/>
          <path d="M460 420 C470 280 540 160 640 40" stroke="#2c4433" stroke-width="11" fill="none"/>
          <path d="M740 420 C720 310 680 220 790 120" stroke="#3f5d47" stroke-width="8" fill="none"/>
          <ellipse cx="145" cy="145" rx="95" ry="52" transform="rotate(-32 145 145)" fill="url(#efLeafA)"/>
          <ellipse cx="290" cy="115" rx="88" ry="48" transform="rotate(24 290 115)" fill="url(#efLeafB)"/>
          <ellipse cx="220" cy="260" rx="108" ry="56" transform="rotate(-18 220 260)" fill="url(#efLeafB)"/>
          <ellipse cx="380" cy="215" rx="102" ry="54" transform="rotate(30 380 215)" fill="url(#efLeafA)"/>
          <ellipse cx="560" cy="120" rx="110" ry="58" transform="rotate(-28 560 120)" fill="url(#efLeafA)"/>
          <ellipse cx="670" cy="225" rx="115" ry="60" transform="rotate(22 670 225)" fill="url(#efLeafB)"/>
          <ellipse cx="515" cy="315" rx="105" ry="54" transform="rotate(-15 515 315)" fill="url(#efLeafA)"/>
          <ellipse cx="775" cy="180" rx="95" ry="50" transform="rotate(-38 775 180)" fill="url(#efLeafB)"/>
          <circle cx="330" cy="95" r="44" fill="#eef4ef" opacity="0.85"/>
          <circle cx="322" cy="88" r="24" fill="#b7cbbd" opacity="0.65"/>
        </svg>
      `;
    }

    function renderEffectsPage() {
      const lightBlurs = effectStylesState.blurs.filter(b => b.tone === 'light');
      const darkBlurs = effectStylesState.blurs.filter(b => b.tone === 'dark');

      return `
        <div class="colors-toolbar-bar">
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            <span class="ds-badge ds-badge-blue">${effectStylesState.shadows.length} Shadows (xs→3xl) • ${effectStylesState.blurs.length} Blurs (Light/Dark)</span>
            <span style="font-size:12px; color:var(--text-secondary);">
              Click vào từng thẻ <strong>Shadow</strong> hoặc thanh <strong>Blur</strong> để kiểm tra thông số lớp Figma, chỉnh sửa trực tiếp hoặc copy CSS.
            </span>
          </div>
          <div style="display:flex; gap:8px;">
            <button class="btn-ds" onclick="resetAllEffects()">↺ Khôi phục mặc định</button>
            <button class="btn-ds ai" onclick="copyText(buildEffectsCSSTokens(), 'Đã copy toàn bộ CSS Tokens Effect Styles')">Copy CSS Tokens</button>
          </div>
        </div>

        <div class="effects-sheet">
          <!-- Intro -->
          <div class="typo-header-block">
            <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.05em;">NỀN TẢNG • FOUNDATIONS / EFFECT STYLES</div>
            <h1 style="font-size:24px; font-weight:700; color:var(--text-primary); margin-top:4px; letter-spacing:-0.02em;">Hệ thống Hiệu ứng: Shadows &amp; Blurs</h1>
            <p style="font-size:13px; color:var(--text-secondary); max-width:840px; margin-top:8px; line-height:1.6;">
              Chuẩn hóa chiều sâu không gian (Elevation) bằng <strong>7 bậc Đổ bóng đa tầng</strong> (từ <code>Shadow xs</code> đến <code>Shadow 3xl</code>) kết hợp cùng <strong>8 hiệu ứng Kính mờ Glassmorphism</strong> (<code>sm → xl</code> cho nền Sáng và Tối) giúp phân tách tầng lớp UI rõ ràng trong các ứng dụng SaaS.
            </p>
          </div>

          <!-- 1. Shadows Section -->
          <div class="effects-section-block">
            <div class="icons-section-head" style="flex-wrap:wrap; gap:8px;">
              <div>
                <div class="icons-section-title">
                  <span>1. Hệ thống Đổ bóng (Shadows — Elevation)</span>
                  <span class="ds-badge ds-badge-gray">${effectStylesState.shadows.length} cấp độ</span>
                </div>
                <div style="font-size:12px; color:var(--text-muted); margin-top:2px;">
                  Đổ bóng mô phỏng thứ bậc nổi bật (Z-index elevation) của bề mặt UI trên nền sáng. Click thẻ bất kỳ để chỉnh từng lớp X / Y / Blur / Spread / Alpha.
                </div>
              </div>
            </div>

            <!-- 7 Visual Shadow Elevation Cards -->
            <div class="shadows-showcase-grid">
              ${effectStylesState.shadows.map(s => {
                const cssVal = buildShadowCssValue(s);
                return `
                  <div class="shadow-stage-card" style="box-shadow:${cssVal};" onclick="openEffectEditor('shadow', '${s.id}')" title="Click chỉnh thông số ${s.name}">
                    <div>
                      <div style="display:flex; align-items:center; justify-content:space-between; gap:8px;">
                        <span class="shadow-card-title">${escapeHTML(s.name)}</span>
                        <span class="ds-badge ds-badge-gray" style="font-size:9.5px;">${s.layers.length} lớp</span>
                      </div>
                      <div class="shadow-card-vi">${escapeHTML(s.vi)}</div>
                    </div>

                    <div class="shadow-layer-pills">
                      ${s.layers.map((l, idx) => `
                        <div class="shadow-layer-chip">
                          L${idx + 1}: X ${l.x} • Y ${l.y} • B ${l.blur} • S ${l.spread} (${Math.round(l.alpha * 100)}%)
                        </div>
                      `).join('')}
                    </div>

                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:10px; padding-top:8px; border-top:1px dashed #eef0f4;" onclick="event.stopPropagation()">
                      <span style="font-family:var(--font-mono); font-size:10px; color:var(--brand-primary);">${s.token}</span>
                      <button type="button" class="typo-edit-pill" onclick="copyShadowCSS('${s.id}')">Copy</button>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>

            <!-- Detailed Vietnamese Parameter Table -->
            <table class="shadows-spec-table">
              <thead>
                <tr>
                  <th style="width:150px;">Tên Token / Cấp độ</th>
                  <th style="width:240px;">Thông số Figma Layers (X / Y / Blur / Spread / Alpha)</th>
                  <th>Mục đích &amp; Thành phần áp dụng</th>
                  <th style="width:130px; text-align:right;">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                ${effectStylesState.shadows.map(s => `
                  <tr>
                    <td>
                      <div style="font-weight:700; color:var(--text-primary);">${escapeHTML(s.name)}</div>
                      <div style="font-size:11px; color:var(--text-secondary);">${escapeHTML(s.vi)}</div>
                      <div style="font-family:var(--font-mono); font-size:10px; color:var(--brand-primary); margin-top:2px;">${s.token}</div>
                    </td>
                    <td style="font-family:var(--font-mono); font-size:11px; color:var(--text-secondary);">
                      ${s.layers.map((l, idx) => `
                        <div>Layer ${idx + 1}: <b>${l.x}px ${l.y}px ${l.blur}px ${l.spread}px</b> • ${l.color} (${Math.round(l.alpha * 100)}%)</div>
                      `).join('')}
                    </td>
                    <td style="color:var(--text-secondary); line-height:1.5;">${escapeHTML(s.usage)}</td>
                    <td style="text-align:right;">
                      <div style="display:inline-flex; gap:4px;">
                        <button type="button" class="typo-edit-pill" onclick="openEffectEditor('shadow', '${s.id}')">Sửa</button>
                        <button type="button" class="typo-edit-pill" onclick="copyShadowCSS('${s.id}')">Copy CSS</button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <!-- 2. Blurs Section -->
          <div class="effects-section-block">
            <div class="icons-section-head" style="flex-wrap:wrap; gap:8px;">
              <div>
                <div class="icons-section-title">
                  <span>2. Hệ thống Kính mờ Nền (Blurs — Glassmorphism)</span>
                  <span class="ds-badge ds-badge-gray">${effectStylesState.blurs.length} biến thể</span>
                </div>
                <div style="font-size:12px; color:var(--text-muted); margin-top:2px;">
                  Áp dụng <code>backdrop-filter</code> kết hợp nền bán trong suốt Light/Dark để tạo chiều sâu hiện đại cho Header, Modal và Overlay trên nền ảnh.
                </div>
              </div>
              <div class="state-group">
                <span>Nền thử nghiệm:</span>
                <div class="seg-control">
                  <button type="button" class="seg-btn ${blurSceneMode === 'botanical' ? 'active' : ''}" onclick="setBlurScene('botanical')">Cảnh lá xanh</button>
                  <button type="button" class="seg-btn ${blurSceneMode === 'gradient' ? 'active' : ''}" onclick="setBlurScene('gradient')">Brand Gradient</button>
                  <button type="button" class="seg-btn ${blurSceneMode === 'dark' ? 'active' : ''}" onclick="setBlurScene('dark')">Nền Đêm (Dark)</button>
                </div>
              </div>
            </div>

            <div class="blurs-canvas-stage scene-${blurSceneMode}">
              ${blurSceneMode === 'botanical' ? renderBotanicalBackdropSVG() : ''}
              <div class="blurs-columns-grid">
                <!-- Light Glass Column -->
                <div class="blurs-col-stack">
                  ${lightBlurs.map(b => `
                    <div class="blur-glass-bar tone-light" style="${buildBlurCssDecl(b)}" onclick="openEffectEditor('blur', '${b.id}')" title="Click chỉnh thông số ${b.name}">
                      <div>
                        <div style="font-size:13px; font-weight:700;">${escapeHTML(b.name)} <span style="font-weight:500; opacity:0.8;">• ${escapeHTML(b.vi)}</span></div>
                        <div style="font-size:11px; opacity:0.85; margin-top:2px;">${escapeHTML(b.usage)}</div>
                      </div>
                      <div style="text-align:right; flex-shrink:0;" onclick="event.stopPropagation()">
                        <div style="font-family:var(--font-mono); font-size:10.5px; font-weight:700;">blur(${b.blur}px) • ${Math.round(b.bgAlpha * 100)}%</div>
                        <button type="button" class="typo-edit-pill" style="margin-top:4px;" onclick="copyBlurCSS('${b.id}')">Copy CSS</button>
                      </div>
                    </div>
                  `).join('')}
                </div>

                <!-- Dark Glass Column -->
                <div class="blurs-col-stack">
                  ${darkBlurs.map(b => `
                    <div class="blur-glass-bar tone-dark" style="${buildBlurCssDecl(b)}" onclick="openEffectEditor('blur', '${b.id}')" title="Click chỉnh thông số ${b.name}">
                      <div>
                        <div style="font-size:13px; font-weight:700;">${escapeHTML(b.name)} <span style="font-weight:500; opacity:0.8;">• ${escapeHTML(b.vi)}</span></div>
                        <div style="font-size:11px; opacity:0.85; margin-top:2px;">${escapeHTML(b.usage)}</div>
                      </div>
                      <div style="text-align:right; flex-shrink:0;" onclick="event.stopPropagation()">
                        <div style="font-family:var(--font-mono); font-size:10.5px; font-weight:700;">blur(${b.blur}px) • ${Math.round(b.bgAlpha * 100)}%</div>
                        <button type="button" class="typo-edit-pill" style="margin-top:4px; background:#1e293b; border-color:rgba(255,255,255,0.38); color:#fff;" onclick="copyBlurCSS('${b.id}')">Copy CSS</button>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>

        </div>
      `;
    }

    // =========================================================================
    // 2F. GRIDS & SPACING ENGINE (Spacing Scale 1..64 & Containers sm..xl)
    // =========================================================================
    const SPACING_STORAGE_KEY = 'destudio_spacing_v1';

    const DEFAULT_SPACING_ITEMS = [
      { id: '1',  name: '1',  px: 4,   token: '--ds-space-1',  usage: 'Khoảng đệm siêu nhỏ giữa icon & nhãn, viền badge' },
      { id: '2',  name: '2',  px: 8,   token: '--ds-space-2',  usage: 'Khoảng cách nội bộ button, input icon, chip tag' },
      { id: '3',  name: '3',  px: 12,  token: '--ds-space-3',  usage: 'Khoảng cách giữa các dòng form gọn, item dropdown' },
      { id: '4',  name: '4',  px: 16,  token: '--ds-space-4',  usage: 'Khoảng cách chuẩn (Base grid) trong card nhỏ, padding input' },
      { id: '5',  name: '5',  px: 20,  token: '--ds-space-5',  usage: 'Đệm tiêu chuẩn cho card nội dung vừa và nhóm nút' },
      { id: '6',  name: '6',  px: 24,  token: '--ds-space-6',  usage: 'Padding chuẩn của Card, Modal body, khoảng cách cột grid' },
      { id: '8',  name: '8',  px: 32,  token: '--ds-space-8',  usage: 'Khoảng cách giữa các cụm component trong cùng một trang' },
      { id: '10', name: '10', px: 40,  token: '--ds-space-10', usage: 'Đệm đầu/cuối phân khu phụ, khoảng tách bảng & header' },
      { id: '12', name: '12', px: 48,  token: '--ds-space-12', usage: 'Khoảng cách giữa các section nội dung chính' },
      { id: '16', name: '16', px: 64,  token: '--ds-space-16', usage: 'Chiều cao thanh Navbar hoặc khoảng thở section Desktop' },
      { id: '20', name: '20', px: 80,  token: '--ds-space-20', usage: 'Khoảng tách khối Dashboard Header / cụm tính năng lớn' },
      { id: '24', name: '24', px: 96,  token: '--ds-space-24', usage: 'Padding dọc cho Section chuẩn trên Landing & SaaS Docs' },
      { id: '32', name: '32', px: 128, token: '--ds-space-32', usage: 'Khoảng thở rộng giữa các cụm Hero / Feature lớn' },
      { id: '40', name: '40', px: 160, token: '--ds-space-40', usage: 'Khoảng lùi bố cục editorial & khung trình diễn màn hình rộng' },
      { id: '48', name: '48', px: 192, token: '--ds-space-48', usage: 'Khoảng cách khối Showcase kích thước lớn' },
      { id: '56', name: '56', px: 224, token: '--ds-space-56', usage: 'Chiều cao vùng hero / khoảng trống đặc biệt Desktop XL' },
      { id: '64', name: '64', px: 256, token: '--ds-space-64', usage: 'Mốc khoảng cách tối đa (Max Spacer) / chiều rộng Sidebar gọn' }
    ];

    const DEFAULT_CONTAINER_ITEMS = [
      { id: 'sm', name: 'sm', px: 640,  token: '--ds-container-sm', usage: 'Khung hẹp cho bài viết, Form đăng nhập, hộp thoại cài đặt tập trung' },
      { id: 'md', name: 'md', px: 768,  token: '--ds-container-md', usage: 'Khung chuẩn Tablet, trang tài liệu và biểu mẫu nhiều cột nhỏ' },
      { id: 'lg', name: 'lg', px: 1024, token: '--ds-container-lg', usage: 'Khung ứng dụng Desktop tiêu chuẩn và Bảng điều khiển vừa' },
      { id: 'xl', name: 'xl', px: 1280, token: '--ds-container-xl', usage: 'Khung tối đa cho SaaS Dashboard rộng và Bảng dữ liệu đa cột' }
    ];

    let spacingState = loadSpacingState();
    let activeSpacingEditor = null; // { kind: 'space'|'container', id }

    function loadSpacingState() {
      const defaults = {
        basePx: 16,
        items: JSON.parse(JSON.stringify(DEFAULT_SPACING_ITEMS)),
        containers: JSON.parse(JSON.stringify(DEFAULT_CONTAINER_ITEMS))
      };
      try {
        const raw = localStorage.getItem(SPACING_STORAGE_KEY);
        if (!raw) return defaults;
        const parsed = JSON.parse(raw);
        return {
          basePx: Number(parsed.basePx) || 16,
          items: Array.isArray(parsed.items) && parsed.items.length ? parsed.items : defaults.items,
          containers: Array.isArray(parsed.containers) && parsed.containers.length ? parsed.containers : defaults.containers
        };
      } catch (e) {
        return defaults;
      }
    }

    function saveSpacingState() {
      try {
        localStorage.setItem(SPACING_STORAGE_KEY, JSON.stringify(spacingState));
      } catch (e) {}
      syncSpacingToCSS();
    }

    function formatRem(px, basePx = spacingState.basePx || 16) {
      const val = Math.round((Number(px) / basePx) * 10000) / 10000;
      return `${val}rem`;
    }

    function formatPxLabel(px) {
      return `${Number(px).toLocaleString('en-US')}px`;
    }

    const DS_BREAKPOINTS = [
      { id: 'mobile', name: 'Mobile', range: '≤ 600px', token: '--ds-bp-mobile-max', px: 600, query: '@media (max-width: 600px)', usage: 'Điện thoại dọc/ngang, stack 1 cột, font input ≥ 16px, CTA full-width' },
      { id: 'tablet', name: 'Tablet', range: '601px – 1023px', token: '--ds-bp-tablet-max', px: 1023, query: '@media (min-width: 601px) and (max-width: 1023px)', usage: 'Máy tính bảng, grid 2 cột, drawer filter rút gọn, thanh điều hướng vừa' },
      { id: 'desktop', name: 'Desktop', range: '≥ 1024px (> 1023px)', token: '--ds-bp-desktop-min', px: 1024, query: '@media (min-width: 1024px)', usage: 'Laptop & Desktop, layout đa cột đầy đủ, inline multi-filter, sidebar cố định' }
    ];

    function syncSpacingToCSS() {
      const root = document.documentElement;
      spacingState.items.forEach(item => {
        root.style.setProperty(item.token, `${item.px}px`);
      });
      spacingState.containers.forEach(c => {
        root.style.setProperty(c.token, `${c.px}px`);
      });
      root.style.setProperty('--ds-bp-mobile-max', '600px');
      root.style.setProperty('--ds-bp-tablet-min', '601px');
      root.style.setProperty('--ds-bp-tablet-max', '1023px');
      root.style.setProperty('--ds-bp-desktop-min', '1024px');
    }

    function buildSpacingCSSTokens() {
      const base = spacingState.basePx || 16;
      const spaceLines = spacingState.items
        .map(item => `  ${item.token}: ${formatRem(item.px, base)}; /* ${formatPxLabel(item.px)} */`)
        .join('\n');
      const containerLines = spacingState.containers
        .map(c => `  ${c.token}: ${formatRem(c.px, base)}; /* ${formatPxLabel(c.px)} */`)
        .join('\n');
      const bpLines = [
        '  --ds-bp-mobile-max: 600px;   /* Mobile: <= 600px */',
        '  --ds-bp-tablet-min: 601px;   /* Tablet start */',
        '  --ds-bp-tablet-max: 1023px;  /* Tablet: 601px - 1023px */',
        '  --ds-bp-desktop-min: 1024px; /* Desktop: >= 1024px (> 1023px) */'
      ].join('\n');
      return `:root {\n  /* === DE STUDIO SPACING SCALE (${base}px base) === */\n${spaceLines}\n\n  /* === DE STUDIO CONTAINERS (${base}px base) === */\n${containerLines}\n\n  /* === DE STUDIO RESPONSIVE BREAKPOINTS === */\n${bpLines}\n}`;
    }

    function copySpacingItemCSS(kind, id) {
      const list = kind === 'space' ? spacingState.items : spacingState.containers;
      const item = list.find(x => x.id === id);
      if (!item) return;
      const prop = kind === 'space'
        ? `gap: var(${item.token}); /* ${formatPxLabel(item.px)} / ${formatRem(item.px)} */`
        : `max-width: var(${item.token}); /* ${formatPxLabel(item.px)} / ${formatRem(item.px)} */`;
      copyText(prop);
    }

    function openSpacingEditor(kind, id) {
      const list = kind === 'space' ? spacingState.items : spacingState.containers;
      const item = list.find(x => x.id === id);
      if (!item) return;
      activeSpacingEditor = { kind, id };
      document.getElementById('seTitle').textContent = kind === 'space'
        ? `Chỉnh sửa Spacing bậc "${item.name}"`
        : `Chỉnh sửa Container "${item.name}"`;
      document.getElementById('seSubtitle').textContent = `Token ${item.token} • Tự động quy đổi REM theo nền ${spacingState.basePx}px`;
      document.getElementById('sePxInput').value = item.px;
      document.getElementById('seUsageInput').value = item.usage || '';
      document.getElementById('seTokenPreview').value = item.token;
      updateSpacingEditorLive();
      document.getElementById('spacingEditorModal').classList.add('open');
    }

    function closeSpacingEditor() {
      document.getElementById('spacingEditorModal').classList.remove('open');
      activeSpacingEditor = null;
    }

    function updateSpacingEditorLive() {
      if (!activeSpacingEditor) return;
      const px = Math.max(1, Number(document.getElementById('sePxInput').value) || 4);
      const rem = formatRem(px);
      document.getElementById('seRemPreview').value = rem;
      const maxRef = activeSpacingEditor.kind === 'space' ? 256 : 1280;
      const pct = Math.min(100, Math.max(2, Math.round((px / maxRef) * 100)));
      document.getElementById('sePreviewBox').innerHTML = `
        <div style="display:flex; align-items:center; justify-content:space-between; font-size:11px; color:var(--text-muted);">
          <span>Minh họa thước trực quan</span>
          <span style="font-family:var(--font-mono); color:#ea580c; font-weight:700;">${formatPxLabel(px)} (${rem})</span>
        </div>
        <div class="spacing-orange-bar has-inner-label" style="width:${pct}%; min-width:52px; justify-content:space-between;">
          <span class="spacing-orange-bar-label">${formatPxLabel(px)}</span>
          <span class="spacing-orange-bar-label" style="opacity:0.75;">${rem}</span>
        </div>
      `;
    }

    function saveSpacingEditor() {
      if (!activeSpacingEditor) return;
      const list = activeSpacingEditor.kind === 'space' ? spacingState.items : spacingState.containers;
      const item = list.find(x => x.id === activeSpacingEditor.id);
      if (!item) return;
      item.px = Math.max(1, Math.round(Number(document.getElementById('sePxInput').value) || item.px));
      item.usage = document.getElementById('seUsageInput').value.trim() || item.usage;
      saveSpacingState();
      closeSpacingEditor();
      renderCanvas();
      showToast(`Đã lưu thông số ${item.token} (${formatPxLabel(item.px)})`);
    }

    function resetSingleSpacingItem() {
      if (!activeSpacingEditor) return;
      const defList = activeSpacingEditor.kind === 'space' ? DEFAULT_SPACING_ITEMS : DEFAULT_CONTAINER_ITEMS;
      const list = activeSpacingEditor.kind === 'space' ? spacingState.items : spacingState.containers;
      const defItem = defList.find(x => x.id === activeSpacingEditor.id);
      const idx = list.findIndex(x => x.id === activeSpacingEditor.id);
      if (defItem && idx >= 0) {
        list[idx] = JSON.parse(JSON.stringify(defItem));
        saveSpacingState();
        openSpacingEditor(activeSpacingEditor.kind, activeSpacingEditor.id);
        renderCanvas();
        showToast(`Đã khôi phục mốc "${defItem.name}"`);
      }
    }

    function resetAllSpacing() {
      spacingState = {
        basePx: 16,
        items: JSON.parse(JSON.stringify(DEFAULT_SPACING_ITEMS)),
        containers: JSON.parse(JSON.stringify(DEFAULT_CONTAINER_ITEMS))
      };
      saveSpacingState();
      renderCanvas();
      showToast('Đã khôi phục toàn bộ thang Spacing & Containers mặc định');
    }

    function renderSpacingBarTrack(px, maxPx) {
      const pct = Math.min(100, Math.max(1.5, (px / maxPx) * 100));
      const label = formatPxLabel(px);
      if (pct >= 28) {
        return `
          <div class="spacing-guide-track">
            <div class="spacing-orange-bar has-inner-label" style="width:${pct.toFixed(2)}%;">
              <span class="spacing-orange-bar-label">${label}</span>
            </div>
          </div>
        `;
      }
      return `
        <div class="spacing-guide-track">
          <div class="spacing-orange-bar" style="width:${pct.toFixed(2)}%; min-width:3px;"></div>
          <span class="spacing-orange-bar-label">${label}</span>
        </div>
      `;
    }

    function renderGridsSpacingPage() {
      const base = spacingState.basePx || 16;
      const maxSpacePx = Math.max(256, ...spacingState.items.map(i => i.px));
      const maxContainerPx = Math.max(1280, ...spacingState.containers.map(c => c.px));

      return `
        <div class="spacing-sheet">
          <div class="colors-topbar" style="margin-bottom:16px;">
            <span class="effects-count-pill">${spacingState.items.length} Spacing (4px–256px) • ${spacingState.containers.length} Containers • 3 Breakpoints (≤600 / 601–1023 / ≥1024)</span>
            <div class="colors-actions">
              <button class="btn-ds" type="button" onclick="resetAllSpacing()">↺ Khôi phục mặc định</button>
              <button class="btn-ds ai" type="button" onclick="copyText(buildSpacingCSSTokens())">Copy CSS Tokens</button>
            </div>
          </div>

          <div style="margin-bottom:20px;">
            <div class="page-category-tag" style="margin-bottom:6px;">NỀN TẢNG • FOUNDATIONS / GRIDS &amp; SPACING</div>
            <h1 style="font-size:28px; font-weight:700; letter-spacing:-0.025em; color:#0f172a; margin-bottom:8px;">Hệ thống Khoảng cách &amp; Khung chứa (Spacing)</h1>
            <p style="font-size:13.5px; color:#475569; max-width:780px; line-height:1.6;">
              Tương tự như thang màu sắc, việc làm việc dựa trên một hệ thống khoảng cách định sẵn giúp bạn thiết kế và lập trình nhanh hơn, đồng nhất hơn. Hệ thống khoảng cách nhất quán và dễ mở rộng giúp loại bỏ sự phỏng đoán trong quá trình thiết kế và phát triển vì bạn luôn sử dụng một tập hợp lựa chọn chuẩn hóa (nền <strong>1rem = ${base}px</strong>).
            </p>
          </div>

          <!-- SECTION 1: SPACING SYSTEM GUIDES -->
          <div class="spacing-section-block">
            <div style="display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap;">
              <div>
                <h2 style="font-size:16px; font-weight:700; color:#0f172a;">
                  1. Thước hướng dẫn hệ thống khoảng cách (Spacing system guides)
                  <span style="font-size:11px; font-weight:600; color:#475569; background:#f1f5f9; padding:2px 8px; border-radius:99px; margin-left:6px;">${spacingState.items.length} bậc</span>
                </h2>
                <p style="font-size:12.5px; color:#64748b; margin-top:4px; max-width:740px; line-height:1.5;">
                  Các thanh hướng dẫn khoảng cách này giúp chú thích trực quan trên bản thiết kế để lập trình viên dễ đọc thông số khi kiểm tra. Công cụ Inspect rất tiện lợi, nhưng hiển thị thước trực quan giúp khoảng cách trở nên rõ ràng và chính xác ngay lập tức.
                </p>
              </div>
            </div>

            <div class="spacing-table-wrap">
              <div class="spacing-table-header">
                <div>Tên (Name)</div>
                <div>Kích thước (nền ${base}px)</div>
                <div>Pixels</div>
                <div>Thước hướng dẫn trực quan (Figma Guides)</div>
                <div style="text-align:right;">Thao tác</div>
              </div>

              <div>
                ${spacingState.items.map((item, idx) => {
                  const posClass = `${idx === 0 ? 'is-first' : ''} ${idx === spacingState.items.length - 1 ? 'is-last' : ''}`.trim();
                  const remStr = formatRem(item.px, base);
                  const pxStr = formatPxLabel(item.px);
                  const trackHtml = renderSpacingBarTrack(item.px, maxSpacePx);
                  return `
                    <div class="spacing-list-row" title="${escapeHTML(item.usage)}">
                      <div class="spacing-meta-col">
                        <span class="spacing-name-pill">${escapeHTML(item.name)}</span>
                        <span class="spacing-token-sub">${escapeHTML(item.token)}</span>
                      </div>
                      <div class="spacing-meta-col" style="font-family:var(--font-mono); font-size:12px;">${remStr}</div>
                      <div class="spacing-meta-col" style="font-family:var(--font-mono); font-size:12px; font-weight:600; color:var(--text-primary);">${pxStr}</div>
                      <div class="spacing-guide-col ${posClass}" onclick="openSpacingEditor('space', '${item.id}')" title="Click để chỉnh thông số ${item.token}">
                        ${trackHtml}
                        ${trackHtml}
                      </div>
                      <div class="spacing-actions-col">
                        <button type="button" class="typo-edit-pill" onclick="openSpacingEditor('space', '${item.id}')">Sửa</button>
                        <button type="button" class="typo-edit-pill" onclick="copySpacingItemCSS('space', '${item.id}')">Copy</button>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          </div>

          <!-- SECTION 2: CONTAINERS -->
          <div class="spacing-section-block">
            <div style="display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap;">
              <div>
                <h2 style="font-size:16px; font-weight:700; color:#0f172a;">
                  2. Hệ thống Khung chứa bố cục (Containers)
                  <span style="font-size:11px; font-weight:600; color:#475569; background:#f1f5f9; padding:2px 8px; border-radius:99px; margin-left:6px;">${spacingState.containers.length} kích thước</span>
                </h2>
                <p style="font-size:12.5px; color:#64748b; margin-top:4px; line-height:1.5;">
                  Làm việc từ một hệ thống chiều rộng khung chứa giới hạn và định sẵn giúp bố cục ứng dụng giữ được nhịp điệu đồng nhất và triển khai nhanh hơn.
                </p>
              </div>
            </div>

            <div class="spacing-table-wrap">
              <div class="spacing-table-header">
                <div>Tên (Name)</div>
                <div>Kích thước (nền ${base}px)</div>
                <div>Pixels</div>
                <div>Độ rộng Khung chứa chuẩn (Max-Width Guides)</div>
                <div style="text-align:right;">Thao tác</div>
              </div>

              <div>
                ${spacingState.containers.map((c, idx) => {
                  const posClass = `is-single-col ${idx === 0 ? 'is-first' : ''} ${idx === spacingState.containers.length - 1 ? 'is-last' : ''}`.trim();
                  const remStr = formatRem(c.px, base);
                  const pxStr = formatPxLabel(c.px);
                  const pct = Math.min(100, Math.max(12, (c.px / maxContainerPx) * 100));
                  return `
                    <div class="spacing-list-row" title="${escapeHTML(c.usage)}">
                      <div class="spacing-meta-col">
                        <span class="spacing-name-pill">${escapeHTML(c.name)}</span>
                        <span class="spacing-token-sub">${escapeHTML(c.token)}</span>
                      </div>
                      <div class="spacing-meta-col" style="font-family:var(--font-mono); font-size:12px;">${remStr}</div>
                      <div class="spacing-meta-col" style="font-family:var(--font-mono); font-size:12px; font-weight:600; color:var(--text-primary);">${pxStr}</div>
                      <div class="spacing-guide-col ${posClass}" onclick="openSpacingEditor('container', '${c.id}')" title="${escapeHTML(c.usage)} — Click để chỉnh sửa">
                        <div class="spacing-container-bar" style="width:${pct.toFixed(2)}%;">
                          <span class="spacing-orange-bar-label" style="flex-shrink:0;">${pxStr}</span>
                          <span style="flex:1; min-width:0; text-align:right; font-size:10.5px; color:#9a3412; font-weight:500; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${escapeHTML(c.usage)}</span>
                        </div>
                      </div>
                      <div class="spacing-actions-col">
                        <button type="button" class="typo-edit-pill" onclick="openSpacingEditor('container', '${c.id}')">Sửa</button>
                        <button type="button" class="typo-edit-pill" onclick="copySpacingItemCSS('container', '${c.id}')">Copy</button>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          </div>

          <!-- SECTION 3: UNIFIED RESPONSIVE BREAKPOINTS -->
          <div class="spacing-section-block">
            <div style="display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap;">
              <div>
                <h2 style="font-size:16px; font-weight:700; color:#0f172a;">
                  3. Hệ thống Breakpoints Responsive Thống nhất
                  <span style="font-size:11px; font-weight:600; color:#155eef; background:#eff4ff; padding:2px 8px; border-radius:99px; margin-left:6px;">3 Khoảng chuẩn</span>
                </h2>
                <p style="font-size:12.5px; color:#64748b; margin-top:4px; line-height:1.5;">
                  Toàn bộ Design System quy chuẩn về đúng 3 dải kích thước thiết bị: <strong>Mobile (≤ 600px)</strong>, <strong>Tablet (601px – 1023px)</strong> và <strong>Desktop (≥ 1024px / &gt; 1023px)</strong>.
                </p>
              </div>
            </div>

            <div class="spacing-table-wrap">
              <div class="spacing-table-header">
                <div>Thiết bị (Device)</div>
                <div>Khoảng Width</div>
                <div>Token CSS</div>
                <div>Media Query &amp; Quy chuẩn Bố cục</div>
                <div style="text-align:right;">Thao tác</div>
              </div>
              <div>
                ${DS_BREAKPOINTS.map((bp, idx) => {
                  const posClass = `is-single-col ${idx === 0 ? 'is-first' : ''} ${idx === DS_BREAKPOINTS.length - 1 ? 'is-last' : ''}`.trim();
                  return `
                    <div class="spacing-list-row">
                      <div class="spacing-meta-col">
                        <span class="spacing-name-pill">${bp.name}</span>
                        <span class="spacing-token-sub">${bp.id.toUpperCase()}</span>
                      </div>
                      <div class="spacing-meta-col" style="font-family:var(--font-mono); font-size:12px; font-weight:700; color:var(--text-primary);">${bp.range}</div>
                      <div class="spacing-meta-col" style="font-family:var(--font-mono); font-size:11.5px; color:#4f46e5;">${bp.token}</div>
                      <div class="spacing-guide-col ${posClass}" style="display:flex; flex-direction:column; align-items:flex-start; justify-content:center; gap:4px; cursor:default;">
                        <code style="font-size:11px; color:#0f172a; background:#f1f5f9; padding:2px 6px; border-radius:4px;">${bp.query}</code>
                        <span style="font-size:11px; color:var(--text-secondary);">${bp.usage}</span>
                      </div>
                      <div class="spacing-actions-col">
                        <button type="button" class="typo-edit-pill" onclick="copyText('${bp.query} { /* ${bp.name} */ }')">Copy</button>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // =========================================================================