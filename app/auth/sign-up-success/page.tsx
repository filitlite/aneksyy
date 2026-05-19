import Link from 'next/link'

export default function SignUpSuccessPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="text-3xl lg:text-4xl font-semibold tracking-tighter">
        Почти <span className="text-accent">готово!</span>
      </h1>
      <p className="mt-4 text-muted-foreground">
        Мы отправили письмо для подтверждения на ваш email. Перейдите по ссылке, чтобы активировать аккаунт.
      </p>
      <Link
        href="/auth/login"
        className="mt-8 inline-flex rounded-full bg-foreground text-background px-7 py-3.5 font-medium hover:bg-accent transition-colors"
      >
        К входу
      </Link>
    </div>
  )
}
