<template>
  <div class="border ring-default rounded space-y-6">
    <section v-if="status === 'pending'">
      <div class="flex flex-col sm:flex-row gap-4">
        <USkeleton class="h-12 w-12 rounded-full" />
        <div class="grid gap-2">
          <USkeleton class="h-4 w-[250px]" />
          <USkeleton class="h-4 w-[200px]" />
        </div>
      </div>
    </section>

    <section v-else-if="status === 'error'">
      <p class="text-red-500">Произошла ошибка</p>
    </section>

    <UCard v-else variant="soft">
      <template #header>
        <div class="flex flex-col">
          <nav class="flex flex-wrap gap-2" aria-label="Управление резюме">
            <UButton
              v-for="(icon, index) in icons"
              :key="index"
              variant="outline"
              :size="icon.url ? 'xl' : 'md'"
              :icon="icon.url"
            >
              {{ icon.name }}
            </UButton>
          </nav>

          <section class="inline-flex flex-col lg:flex-row gap-4 pt-5">
            <div
              class="w-24 h-23 sm:w-32 sm:h-32 self-center rounded-md flex items-center justify-center"
            >
              <UAvatar
                class="w-auto h-full"
                :src="photoApiURL + data?.photo"
                alt="Аватар"
                size="xl"
              />
            </div>
            <div class="flex-col flex gap-1">
              <div class="border-1 p-2 rounded-xl ring-0">
                <span class="text-lg lg:text-xl font-semibold">{{
                  data?.name
                }}</span>
                <p class="text-xs sm:text-base">
                  Кандидат на вакансию:
                  <a href="#" class="underline">{{ data?.listing_id }}</a>
                  <span class="text-sm ml-1">
                    <a href="#" class="underline"
                      >({{
                        new Date(data?.date || "").toLocaleDateString("ru-RU")
                      }}
                      Отлик)</a
                    >
                  </span>
                </p>
              </div>
              <div
                class="inline-flex gap-4 justify-between border-1 rounded-xl p-2 ring-0"
              >
                <div class="flex flex-col">
                  <p class="text-xs sm:text-base">
                    Город: {{ data.town || "Не указан" }}
                  </p>
                  <p class="text-xs sm:text-base">
                    Статус: {{ currentStatus }}
                  </p>
                  <p class="text-xs sm:text-base">{{ currentAge }}</p>
                </div>
                <div class="flex flex-col self-end">
                  <p class="space-x-2 text-xs sm:text-base">
                    <UIcon name="i-heroicons-phone" />
                    <a class="underline" :href="'tel:' + currentTelephone">
                      {{ currentTelephone }}
                    </a>
                  </p>
                  <p class="space-x-2 text-xs sm:text-base">
                    <UIcon name="i-heroicons-envelope" />
                    <a class="underline" :href="'mailto:' + currentEmail">
                      {{ currentEmail }}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </template>

      <section
        class="flex flex-col md:flex-row gap-2"
        aria-label="Действия над заявкой"
      >
        <UButton
          class="p-6"
          :variant="data?.status === 'viewed' ? 'solid' : 'outline'"
        >
          Собеседование запланированно</UButton
        >
        <UButton variant="outline">Создать видеозвонок</UButton>
        <UButton disabled variant="outline">Запланировать событие</UButton>
        <UButton variant="outline">Отправить запрос</UButton>
      </section>

      <section class="overflow-x-auto mt-2">
        <p class="text-base sm:text-lg">Статус рассмотрения:</p>
        <div class="w-full mt-2">
          <UStepper
            :default-value="1"
            orientation="vertical"
            size="xs"
            disabled
            :items="steps"
          />
        </div>
      </section>

      <!-- Accordion Footer -->
      <template #footer>
        <div class="border p-2 rounded">
          <h3 class="font-semibold">Описание:</h3>
          <p class="text-xs md:text-base mt-2 whitespace-pre-line">
            {{ data?.description || "Нету" }}
          </p>
        </div>
        <div class="border mt-4 p-2 rounded">
          <h3 class="font-semibold">Файлы портфолио:</h3>
          <div class="mt-2 space-y-1">
            <template v-if="Array.isArray(data?.portfolios)">
              <a
                v-for="(file, index) in data.portfolios"
                :key="index"
                :href="file.url"
                class="block underline text-white text-sm hover:text-gray-200"
              >
                {{ file.name }}
              </a>
            </template>
            <p v-else class="text-sm">Нету</p>
          </div>
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();
const wpApiUrl = config.public.apiBase;
const photoApiURL = config.public.photoBase;
const { data, status } = useFetch(`${wpApiUrl}/test/v2/app`, {
  lazy: true,
});

const icons = [
  {
    url: "i-heroicons-document",
  },
  {
    name: "PDF",
  },
  {
    name: "DOC",
  },
  {
    url: "i-heroicons-document-text",
  },
  {
    url: "i-heroicons-trash",
  },
  {
    url: "i-heroicons-document-arrow-up",
  },
  {
    url: "i-heroicons-heart",
  },
];

const statused = {
  viewed: "Просмотрено",
  applied: "Принято",
  rejected: "Отказано",
};

const currentStatus = computed(() => statused[data.value.status]);
const currentAge = computed(() => {
  if (!data.value.birth_date) {
    return "Возраст не указан";
  }
  const birthday = new Date(data.value.birth_date);
  const today = new Date();

  let age = today.getFullYear() - birthday.getFullYear();
  const monthDiff = today.getMonth() - birthday.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthday.getDate())
  ) {
    age--;
  }

  const pluralRules = new Intl.PluralRules("ru-RU");
  const suffix = {
    one: "год",
    few: "года",
    many: "лет",
    other: "лет",
  }[pluralRules.select(age)];

  return `${age} ${suffix}`;
});

const currentTelephone = computed(() => formatRussianPhone(data.value.phone));
const currentEmail = computed(() => data.value.email);

function formatRussianPhone(phone) {
  const cleaned = phone.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/);

  if (match) {
    return `+${match[1]} ${match[2]} ${match[3]}-${match[4]}-${match[5]}`;
  }

  return phone;
}

const steps = ref([
  { title: "Новое", active: true },
  { title: "Просмотрено", active: true },
  { title: "Отправлено приглашение", active: false },
  { title: "Назначено собеседование", active: false },
  { title: "Не дошел", active: false },
  { title: "Проведено собеседование", active: false },
  { title: "Ожидание ответа соискателя", active: false },
  { title: "Принятие решения", active: false },
  { title: "Принят", active: false },
  { title: "Отклонено/Отказ", active: false },
  { title: "Архивировано", active: false },
]);
</script>
